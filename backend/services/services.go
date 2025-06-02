package services

import (
	"errors"
	"golang.org/x/crypto/bcrypt"
	"grocery-store-api/models"
	"grocery-store-api/repositories"
	"time"
)

type UserService struct {
	Repo repositories.UserRepository
}

func (s *UserService) Register(req models.RegisterRequest) (*models.User, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	user := &models.User{
		Username:  req.Username,
		Password:  string(hashedPassword),
		Role:      req.Role,
		CreatedAt: time.Now(),
	}

	err = s.Repo.Create(user)
	return user, err
}

func (s *UserService) Login(req models.LoginRequest) (*models.User, error) {
	user, err := s.Repo.FindByUsername(req.Username)
	if err != nil {
		return nil, err
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password))
	if err != nil {
		return nil, errors.New("неверный пароль")
	}

	return user, nil
}

func (s *UserService) GetUserByID(id uint) (*models.User, error) {
	return s.Repo.FindByID(id)
}

type ProductService struct {
	Repo repositories.ProductRepository
}

func (s *ProductService) CreateProduct(product *models.Product) error {
	return s.Repo.Create(product)
}

func (s *ProductService) GetProductByID(id uint) (*models.Product, error) {
	return s.Repo.FindByID(id)
}

func (s *ProductService) GetAllProducts() ([]models.Product, error) {
	return s.Repo.FindAll()
}

func (s *ProductService) UpdateProduct(product *models.Product) error {
	return s.Repo.Update(product)
}

func (s *ProductService) DeleteProduct(id uint) error {
	return s.Repo.Delete(id)
}

func (s *ProductService) GetProductsByDepartment(departmentID uint) ([]models.Product, error) {
	return s.Repo.FindByDepartment(departmentID)
}

func (s *ProductService) GetProductsBySupplier(supplierID uint) ([]models.Product, error) {
	return s.Repo.FindBySupplier(supplierID)
}

func (s *ProductService) UpdateStock(id uint, quantity int) error {
	return s.Repo.UpdateStock(id, quantity)
}

type DepartmentService struct {
	Repo repositories.DepartmentRepository
}

func (s *DepartmentService) CreateDepartment(department *models.Department) error {
	return s.Repo.Create(department)
}

func (s *DepartmentService) GetDepartmentByID(id uint) (*models.Department, error) {
	return s.Repo.FindByID(id)
}

func (s *DepartmentService) GetAllDepartments() ([]models.Department, error) {
	return s.Repo.FindAll()
}

func (s *DepartmentService) UpdateDepartment(department *models.Department) error {
	return s.Repo.Update(department)
}

func (s *DepartmentService) DeleteDepartment(id uint) error {
	return s.Repo.Delete(id)
}

type SupplierService struct {
	Repo repositories.SupplierRepository
}

func (s *SupplierService) CreateSupplier(supplier *models.Supplier) error {
	return s.Repo.Create(supplier)
}

func (s *SupplierService) GetSupplierByID(id uint) (*models.Supplier, error) {
	return s.Repo.FindByID(id)
}

func (s *SupplierService) GetAllSuppliers() ([]models.Supplier, error) {
	return s.Repo.FindAll()
}

func (s *SupplierService) UpdateSupplier(supplier *models.Supplier) error {
	return s.Repo.Update(supplier)
}

func (s *SupplierService) DeleteSupplier(id uint) error {
	return s.Repo.Delete(id)
}

type SaleService struct {
	Repo        repositories.SaleRepository
	ProductRepo repositories.ProductRepository
}

func (s *SaleService) CreateSale(sale *models.Sale) error {
	err := s.Repo.Create(sale)
	if err != nil {
		return err
	}

	return s.ProductRepo.UpdateStock(sale.ProductID, -sale.Quantity)
}

func (s *SaleService) GetSaleByID(id uint) (*models.Sale, error) {
	return s.Repo.FindByID(id)
}

func (s *SaleService) GetAllSales() ([]models.Sale, error) {
	return s.Repo.FindAll()
}

func (s *SaleService) GetSalesByDateRange(start, end string) ([]models.Sale, error) {
	return s.Repo.FindByDateRange(start, end)
}

type SupplyService struct {
	Repo        repositories.SupplyRepository
	ItemRepo    repositories.SupplyItemRepository
	ProductRepo repositories.ProductRepository
}

func (s *SupplyService) CreateSupply(supply *models.Supply, items []models.SupplyItem) error {
	err := s.Repo.Create(supply)
	if err != nil {
		return err
	}

	for i := range items {
		items[i].SupplyID = supply.ID
		err = s.ItemRepo.Create(&items[i])
		if err != nil {
			return err
		}

		err = s.ProductRepo.UpdateStock(items[i].ProductID, items[i].Quantity)
		if err != nil {
			return err
		}
	}

	return nil
}

func (s *SupplyService) GetSupplyByID(id uint) (*models.Supply, error) {
	supply, err := s.Repo.FindByID(id)
	if err != nil {
		return nil, err
	}

	items, err := s.ItemRepo.FindBySupplyID(id)
	if err == nil {
		supply.Items = items
	}

	return supply, nil
}

func (s *SupplyService) GetAllSupplies() ([]models.Supply, error) {
	return s.Repo.FindAll()
}
