package main

import (
	"log"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"

	"grocery-store-api/controllers"
	_ "grocery-store-api/docs"
	"grocery-store-api/middlewares"
	"grocery-store-api/models"
	"grocery-store-api/repositories"
	"grocery-store-api/services"
)

// @title           Grocery Store API
// @version         1.0
// @description     REST API для продовольственного магазина с управлением товарами, отделами, поставщиками, продажами и поставками
// @termsOfService  http://swagger.io/terms/

// @contact.name   API Support
// @contact.url    http://www.grocery-store.com/support
// @contact.email  support@grocery-store.com

// @license.name  Apache 2.0
// @license.url   http://www.apache.org/licenses/LICENSE-2.0.html

// @host      localhost:8090
// @BasePath  /api

// @securityDefinitions.apikey BearerAuth
// @in header
// @name Authorization
// @description Токен аутентификации в формате "Bearer {token}"

func main() {
	// Инициализация базы данных
	db, err := gorm.Open(sqlite.Open("grocery_store.db"), &gorm.Config{})
	if err != nil {
		log.Fatal("Ошибка подключения к базе данных:", err)
	}

	// Миграция схемы базы данных
	db.AutoMigrate(
		&models.User{},
		&models.Department{},
		&models.Supplier{},
		&models.Product{},
		&models.Sale{},
		&models.Supply{},
		&models.SupplyItem{},
	)

	// Инициализация репозиториев
	userRepo := repositories.UserRepository{DB: db}
	productRepo := repositories.ProductRepository{DB: db}
	departmentRepo := repositories.DepartmentRepository{DB: db}
	supplierRepo := repositories.SupplierRepository{DB: db}
	saleRepo := repositories.SaleRepository{DB: db}
	supplyRepo := repositories.SupplyRepository{DB: db}
	supplyItemRepo := repositories.SupplyItemRepository{DB: db}

	// Инициализация сервисов
	userService := services.UserService{Repo: userRepo}
	productService := services.ProductService{Repo: productRepo}
	departmentService := services.DepartmentService{Repo: departmentRepo}
	supplierService := services.SupplierService{Repo: supplierRepo}
	saleService := services.SaleService{
		Repo:        saleRepo,
		ProductRepo: productRepo,
	}
	supplyService := services.SupplyService{
		Repo:        supplyRepo,
		ItemRepo:    supplyItemRepo,
		ProductRepo: productRepo,
	}

	// Инициализация обработчиков
	userHandler := controllers.UserHandler{Service: userService}
	productHandler := controllers.ProductHandler{Service: productService}
	departmentHandler := controllers.DepartmentHandler{Service: departmentService}
	supplierHandler := controllers.SupplierHandler{Service: supplierService}
	saleHandler := controllers.SaleHandler{Service: saleService}
	supplyHandler := controllers.SupplyHandler{Service: supplyService}
	analyticsHandler := controllers.AnalyticsHandler{
		SaleService:    saleService,
		ProductService: productService,
	}

	// Инициализация роутера Gin
	r := gin.Default()

	// Настройка CORS
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	// Swagger UI
	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	// Публичные маршруты
	r.POST("/api/register", userHandler.Register)
	r.POST("/api/login", userHandler.Login)

	// Защищенные маршруты
	api := r.Group("/api")
	api.Use(middlewares.JWTAuth())

	// Маршруты для товаров
	api.GET("/products", productHandler.GetAll)
	api.GET("/products/:id", productHandler.GetByID)
	api.POST("/products", middlewares.ManagerAuth(), productHandler.Create)
	api.PUT("/products/:id", middlewares.ManagerAuth(), productHandler.Update)
	api.DELETE("/products/:id", middlewares.AdminAuth(), productHandler.Delete)

	// Маршруты для отделов
	api.GET("/departments", departmentHandler.GetAll)
	api.GET("/departments/:id", departmentHandler.GetByID)
	api.POST("/departments", middlewares.ManagerAuth(), departmentHandler.Create)
	api.PUT("/departments/:id", middlewares.ManagerAuth(), departmentHandler.Update)
	api.DELETE("/departments/:id", middlewares.AdminAuth(), departmentHandler.Delete)

	// Маршруты для поставщиков
	api.GET("/suppliers", supplierHandler.GetAll)
	api.GET("/suppliers/:id", supplierHandler.GetByID)
	api.POST("/suppliers", middlewares.ManagerAuth(), supplierHandler.Create)
	api.PUT("/suppliers/:id", middlewares.ManagerAuth(), supplierHandler.Update)
	api.DELETE("/suppliers/:id", middlewares.AdminAuth(), supplierHandler.Delete)

	// Маршруты для продаж
	api.GET("/sales", middlewares.ManagerAuth(), saleHandler.GetAll)
	api.GET("/sales/:id", middlewares.CashierAuth(), saleHandler.GetByID)
	api.POST("/sales", middlewares.CashierAuth(), saleHandler.Create)

	// Маршруты для поставок
	api.GET("/supplies", middlewares.ManagerAuth(), supplyHandler.GetAll)
	api.GET("/supplies/:id", middlewares.ManagerAuth(), supplyHandler.GetByID)
	api.POST("/supplies", middlewares.ManagerAuth(), supplyHandler.Create)

	// Маршруты для аналитики
	analytics := api.Group("/analytics")
	analytics.Use(middlewares.ManagerAuth())
	analytics.GET("/low-stock", analyticsHandler.GetLowStockProducts)
	analytics.GET("/sales", analyticsHandler.GetSalesByPeriod)

	// Запуск сервера на порту 8000
	r.Run(":8000")
}
