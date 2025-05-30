package main

import (
	"context"
	"fmt"
	"log"
	"log/slog"
	"os"

	"github.com/capmoo/api/api"
	"github.com/capmoo/api/cmd/api/di"
	"github.com/capmoo/api/config"
	"github.com/capmoo/api/logger"
	"github.com/capmoo/api/middleware"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	fiberrecover "github.com/gofiber/fiber/v2/middleware/recover"
	"github.com/gofiber/fiber/v2/middleware/requestid"
)

func main() {
	ctx := context.Background()

	defer func() {
		if r := recover(); r != nil {
			slog.Error("recover from panic!",
				slog.Any("err", r),
			)
		}
	}()

	logger.SetupMinimalLogger()
	cfg := config.LoadConfig()
	logger.InitLogger(cfg)

	log.Print("Starting API server...")

	v1Handler, err := di.InitDI(ctx, cfg)
	if err != nil {
		slog.Error("failed to initialize DI, exiting...",
			"error", err)
		os.Exit(1)
		return
	}

	app := fiber.New(fiber.Config{
		ErrorHandler: api.HandleError,
	})

	app.Use(
		cors.New(cors.Config{
			AllowOrigins: cfg.AllowedOrigins,
			AllowHeaders: cfg.AllowedHeaders,
		}),
		requestid.New(),
		middleware.SetupUserContext,
		middleware.AccessLogMiddleware,
		fiberrecover.New(
			fiberrecover.Config{
				Next:              nil,
				EnableStackTrace:  true,
				StackTraceHandler: api.HandlePanicStackTrace,
			},
		),
	)

	v1Handler.RegisterV1Router(app)

	log.Fatal(app.Listen(
		fmt.Sprintf(":%d", cfg.Port),
	))
}
