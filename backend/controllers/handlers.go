package controllers

import (
	"grocery-store-api/middlewares"
	"grocery-store-api/models"
	"grocery-store-api/services"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
)

type UserHandler struct {
	Service services.UserService
}

func (h *UserHandler) Register(c *gin.Context) {
	var req models.RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user, err := h.Service.Register(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "пользователь зарегистрирован", "user": user})
}

func (h *UserHandler) Login(c *gin.Context) {
	var req models.LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user, err := h.Service.Login(req)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	token, err := middlewares.GenerateToken(user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ошибка создания токена"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"token": token, "user": user})
}

type ProductHandler struct {
	Service services.ProductService
}

func (h *ProductHandler) Create(c *gin.Context) {
	var product models.Product
	if err := c.ShouldBindJSON(&product); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.Service.CreateProduct(&product); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, product)
}

func (h *ProductHandler) GetByID(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "некорректный ID"})
		return
	}

	product, err := h.Service.GetProductByID(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "товар не найден"})
		return
	}

	c.JSON(http.StatusOK, product)
}

func (h *ProductHandler) GetAll(c *gin.Context) {
	departmentID := c.Query("department_id")
	supplierID := c.Query("supplier_id")

	var products []models.Product
	var err error

	if departmentID != "" {
		id, err := strconv.ParseUint(departmentID, 10, 32)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "некорректный ID отдела"})
			return
		}
		products, err = h.Service.GetProductsByDepartment(uint(id))
	} else if supplierID != "" {
		id, err := strconv.ParseUint(supplierID, 10, 32)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "некорректный ID поставщика"})
			return
		}
		products, err = h.Service.GetProductsBySupplier(uint(id))
	} else {
		products, err = h.Service.GetAllProducts()
	}

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, products)
}

func (h *ProductHandler) Update(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "некорректный ID"})
		return
	}

	var product models.Product
	if err := c.ShouldBindJSON(&product); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	product.ID = uint(id)
	if err := h.Service.UpdateProduct(&product); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, product)
}

func (h *ProductHandler) Delete(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "некорректный ID"})
		return
	}

	if err := h.Service.DeleteProduct(uint(id)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "товар удален"})
}

type DepartmentHandler struct {
	Service services.DepartmentService
}

func (h *DepartmentHandler) Create(c *gin.Context) {
	var department models.Department
	if err := c.ShouldBindJSON(&department); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.Service.CreateDepartment(&department); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, department)
}

func (h *DepartmentHandler) GetByID(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "некорректный ID"})
		return
	}

	department, err := h.Service.GetDepartmentByID(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "отдел не найден"})
		return
	}

	c.JSON(http.StatusOK, department)
}

func (h *DepartmentHandler) GetAll(c *gin.Context) {
	departments, err := h.Service.GetAllDepartments()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, departments)
}

func (h *DepartmentHandler) Update(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "некорректный ID"})
		return
	}

	var department models.Department
	if err := c.ShouldBindJSON(&department); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	department.ID = uint(id)
	if err := h.Service.UpdateDepartment(&department); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, department)
}

func (h *DepartmentHandler) Delete(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "некорректный ID"})
		return
	}

	if err := h.Service.DeleteDepartment(uint(id)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "отдел удален"})
}

type SupplierHandler struct {
	Service services.SupplierService
}

func (h *SupplierHandler) Create(c *gin.Context) {
	var supplier models.Supplier
	if err := c.ShouldBindJSON(&supplier); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.Service.CreateSupplier(&supplier); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, supplier)
}

func (h *SupplierHandler) GetByID(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "некорректный ID"})
		return
	}

	supplier, err := h.Service.GetSupplierByID(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "поставщик не найден"})
		return
	}

	c.JSON(http.StatusOK, supplier)
}

func (h *SupplierHandler) GetAll(c *gin.Context) {
	suppliers, err := h.Service.GetAllSuppliers()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, suppliers)
}

func (h *SupplierHandler) Update(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "некорректный ID"})
		return
	}

	var supplier models.Supplier
	if err := c.ShouldBindJSON(&supplier); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	supplier.ID = uint(id)
	if err := h.Service.UpdateSupplier(&supplier); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, supplier)
}

func (h *SupplierHandler) Delete(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "некорректный ID"})
		return
	}

	if err := h.Service.DeleteSupplier(uint(id)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "поставщик удален"})
}

type SaleHandler struct {
	Service services.SaleService
}

func (h *SaleHandler) Create(c *gin.Context) {
	var sale models.Sale
	if err := c.ShouldBindJSON(&sale); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userID, _ := c.Get("userID")
	sale.CashierID = userID.(uint)
	sale.SaleDate = time.Now()

	if err := h.Service.CreateSale(&sale); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, sale)
}

func (h *SaleHandler) GetByID(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "некорректный ID"})
		return
	}

	sale, err := h.Service.GetSaleByID(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "продажа не найдена"})
		return
	}

	c.JSON(http.StatusOK, sale)
}

func (h *SaleHandler) GetAll(c *gin.Context) {
	startDate := c.Query("start_date")
	endDate := c.Query("end_date")

	var sales []models.Sale
	var err error

	if startDate != "" && endDate != "" {
		sales, err = h.Service.GetSalesByDateRange(startDate, endDate)
	} else {
		sales, err = h.Service.GetAllSales()
	}

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, sales)
}

type SupplyHandler struct {
	Service services.SupplyService
}

func (h *SupplyHandler) Create(c *gin.Context) {
	var requestData struct {
		Supply models.Supply       `json:"supply"`
		Items  []models.SupplyItem `json:"items"`
	}

	if err := c.ShouldBindJSON(&requestData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userID, _ := c.Get("userID")
	requestData.Supply.ApprovedBy = userID.(uint)
	requestData.Supply.SupplyDate = time.Now()

	if err := h.Service.CreateSupply(&requestData.Supply, requestData.Items); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, requestData.Supply)
}

func (h *SupplyHandler) GetByID(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "некорректный ID"})
		return
	}

	supply, err := h.Service.GetSupplyByID(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "поставка не найдена"})
		return
	}

	c.JSON(http.StatusOK, supply)
}

func (h *SupplyHandler) GetAll(c *gin.Context) {
	supplies, err := h.Service.GetAllSupplies()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, supplies)
}

type AnalyticsHandler struct {
	SaleService    services.SaleService
	ProductService services.ProductService
}

func (h *AnalyticsHandler) GetLowStockProducts(c *gin.Context) {
	products, err := h.ProductService.GetAllProducts()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	var lowStockProducts []models.Product
	for _, product := range products {
		if product.CurrentQty <= product.MinThreshold {
			lowStockProducts = append(lowStockProducts, product)
		}
	}

	c.JSON(http.StatusOK, lowStockProducts)
}

func (h *AnalyticsHandler) GetSalesByPeriod(c *gin.Context) {
	startDate := c.Query("start_date")
	endDate := c.Query("end_date")

	if startDate == "" || endDate == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "требуются параметры start_date и end_date"})
		return
	}

	sales, err := h.SaleService.GetSalesByDateRange(startDate, endDate)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Аналитика продаж
	var totalRevenue float64
	productSales := make(map[uint]int)

	for _, sale := range sales {
		totalRevenue += sale.TotalPrice
		productSales[sale.ProductID] += sale.Quantity
	}

	c.JSON(http.StatusOK, gin.H{
		"total_sales":   len(sales),
		"total_revenue": totalRevenue,
		"product_sales": productSales,
	})
}
