package repositories

import (
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
	"grocery-store-api/models"
)

type UserRepository struct {
	DB *gorm.DB
}

func (r *UserRepository) Create(user *models.User) error {
	return r.DB.Clauses(clause.OnConflict{DoNothing: true}).Create(user).Error
}

func (r *UserRepository) FindByID(id uint) (*models.User, error) {
	var user models.User
	err := r.DB.First(&user, id).Error
	return &user, err
}

func (r *UserRepository) FindByUsername(username string) (*models.User, error) {
	var user models.User
	err := r.DB.Where("username = ?", username).First(&user).Error
	return &user, err
}

func (r *UserRepository) Update(user *models.User) error {
	return r.DB.Updates(user).Error
}

func (r *UserRepository) Delete(id uint) error {
	return r.DB.Delete(&models.User{}, id).Error
}

type ProductRepository struct {
	DB *gorm.DB
}

func (r *ProductRepository) Create(product *models.Product) error {
	return r.DB.Clauses(clause.OnConflict{DoNothing: true}).Create(product).Error
}

func (r *ProductRepository) FindByID(id uint) (*models.Product, error) {
	var product models.Product
	err := r.DB.Preload("Department").Preload("Supplier").First(&product, id).Error
	return &product, err
}

func (r *ProductRepository) FindAll() ([]models.Product, error) {
	var products []models.Product
	err := r.DB.Preload("Department").Preload("Supplier").Find(&products).Error
	return products, err
}

func (r *ProductRepository) Update(product *models.Product) error {
	return r.DB.Updates(product).Error
}

func (r *ProductRepository) Delete(id uint) error {
	return r.DB.Delete(&models.Product{}, id).Error
}

func (r *ProductRepository) FindByDepartment(departmentID uint) ([]models.Product, error) {
	var products []models.Product
	err := r.DB.Preload("Department").Preload("Supplier").Where("department_id = ?", departmentID).Find(&products).Error
	return products, err
}

func (r *ProductRepository) FindBySupplier(supplierID uint) ([]models.Product, error) {
	var products []models.Product
	err := r.DB.Preload("Department").Preload("Supplier").Where("supplier_id = ?", supplierID).Find(&products).Error
	return products, err
}

func (r *ProductRepository) UpdateStock(id uint, quantity int) error {
	return r.DB.Model(&models.Product{}).Where("id = ?", id).Update("current_qty", gorm.Expr("current_qty + ?", quantity)).Error
}

type DepartmentRepository struct {
	DB *gorm.DB
}

func (r *DepartmentRepository) Create(department *models.Department) error {
	return r.DB.Clauses(clause.OnConflict{DoNothing: true}).Create(department).Error
}

func (r *DepartmentRepository) FindByID(id uint) (*models.Department, error) {
	var department models.Department
	err := r.DB.First(&department, id).Error
	return &department, err
}

func (r *DepartmentRepository) FindAll() ([]models.Department, error) {
	var departments []models.Department
	err := r.DB.Find(&departments).Error
	return departments, err
}

func (r *DepartmentRepository) Update(department *models.Department) error {
	return r.DB.Updates(department).Error
}

func (r *DepartmentRepository) Delete(id uint) error {
	return r.DB.Delete(&models.Department{}, id).Error
}

type SupplierRepository struct {
	DB *gorm.DB
}

func (r *SupplierRepository) Create(supplier *models.Supplier) error {
	return r.DB.Clauses(clause.OnConflict{DoNothing: true}).Create(supplier).Error
}

func (r *SupplierRepository) FindByID(id uint) (*models.Supplier, error) {
	var supplier models.Supplier
	err := r.DB.First(&supplier, id).Error
	return &supplier, err
}

func (r *SupplierRepository) FindAll() ([]models.Supplier, error) {
	var suppliers []models.Supplier
	err := r.DB.Find(&suppliers).Error
	return suppliers, err
}

func (r *SupplierRepository) Update(supplier *models.Supplier) error {
	return r.DB.Updates(supplier).Error
}

func (r *SupplierRepository) Delete(id uint) error {
	return r.DB.Delete(&models.Supplier{}, id).Error
}

type SaleRepository struct {
	DB *gorm.DB
}

func (r *SaleRepository) Create(sale *models.Sale) error {
	return r.DB.Clauses(clause.OnConflict{DoNothing: true}).Create(sale).Error
}

func (r *SaleRepository) FindByID(id uint) (*models.Sale, error) {
	var sale models.Sale
	err := r.DB.Preload("Product").Preload("Cashier").First(&sale, id).Error
	return &sale, err
}

func (r *SaleRepository) FindAll() ([]models.Sale, error) {
	var sales []models.Sale
	err := r.DB.Preload("Product").Preload("Cashier").Find(&sales).Error
	return sales, err
}

func (r *SaleRepository) FindByDateRange(start, end string) ([]models.Sale, error) {
	var sales []models.Sale
	err := r.DB.Preload("Product").Preload("Cashier").Where("sale_date BETWEEN ? AND ?", start, end).Find(&sales).Error
	return sales, err
}

type SupplyRepository struct {
	DB *gorm.DB
}

func (r *SupplyRepository) Create(supply *models.Supply) error {
	return r.DB.Clauses(clause.OnConflict{DoNothing: true}).Create(supply).Error
}

func (r *SupplyRepository) FindByID(id uint) (*models.Supply, error) {
	var supply models.Supply
	err := r.DB.Preload("Supplier").Preload("Approver").First(&supply, id).Error
	return &supply, err
}

func (r *SupplyRepository) FindAll() ([]models.Supply, error) {
	var supplies []models.Supply
	err := r.DB.Preload("Supplier").Preload("Approver").Find(&supplies).Error
	return supplies, err
}

type SupplyItemRepository struct {
	DB *gorm.DB
}

func (r *SupplyItemRepository) Create(item *models.SupplyItem) error {
	return r.DB.Clauses(clause.OnConflict{DoNothing: true}).Create(item).Error
}

func (r *SupplyItemRepository) FindBySupplyID(supplyID uint) ([]models.SupplyItem, error) {
	var items []models.SupplyItem
	err := r.DB.Preload("Product").Where("supply_id = ?", supplyID).Find(&items).Error
	return items, err
}
