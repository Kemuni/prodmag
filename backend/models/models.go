package models

import (
	"time"
)

type User struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	Username  string    `json:"username" gorm:"varchar(50)"`
	Password  string    `json:"password" gorm:"varchar(255)"`
	Role      string    `json:"role" gorm:"varchar(20)"`
	CreatedAt time.Time `json:"created_at" gorm:"timestamp"`
}

type Department struct {
	ID          uint   `json:"id" gorm:"primaryKey"`
	Name        string `json:"name" gorm:"varchar(100)"`
	Description string `json:"description" gorm:"text"`
	ManagerID   uint   `json:"manager_id" gorm:"bigint"`
}

type Supplier struct {
	ID            uint   `json:"id" gorm:"primaryKey"`
	Name          string `json:"name" gorm:"varchar(100)"`
	Phone         string `json:"phone" gorm:"varchar(30)"`
	ContactPerson string `json:"contact_person" gorm:"text"`
}

type Product struct {
	ID           uint      `json:"id" gorm:"primaryKey"`
	Name         string    `json:"name" gorm:"varchar(100)"`
	DepartmentID uint      `json:"department_id" gorm:"bigint"`
	SupplierID   uint      `json:"supplier_id" gorm:"bigint"`
	Grade        string    `json:"grade" gorm:"varchar(1)"`
	Price        float64   `json:"price" gorm:"decimal(10,2)"`
	CurrentQty   int       `json:"current_quantity" gorm:"int"`
	MinThreshold int       `json:"min_threshold" gorm:"int"`
	ExpiryDate   time.Time `json:"expiry_date" gorm:"date"`
	StorageCond  string    `json:"storage_cond" gorm:"varchar(20)"`

	Department Department `json:"department" gorm:"foreignKey:DepartmentID"`
	Supplier   Supplier   `json:"supplier" gorm:"foreignKey:SupplierID"`
}

type Sale struct {
	ID         uint      `json:"id" gorm:"primaryKey"`
	ProductID  uint      `json:"product_id" gorm:"bigint"`
	Quantity   int       `json:"quantity" gorm:"int"`
	TotalPrice float64   `json:"total_price" gorm:"decimal(10,2)"`
	SaleDate   time.Time `json:"sale_date" gorm:"timestamp"`
	CashierID  uint      `json:"cashier_id" gorm:"bigint"`

	Product Product `json:"product" gorm:"foreignKey:ProductID"`
	Cashier User    `json:"cashier" gorm:"foreignKey:CashierID"`
}

type Supply struct {
	ID         uint      `json:"id" gorm:"primaryKey"`
	SupplierID uint      `json:"supplier_id" gorm:"bigint"`
	SupplyDate time.Time `json:"supply_date" gorm:"date"`
	TotalCost  float64   `json:"total_cost" gorm:"decimal(10,2)"`
	ApprovedBy uint      `json:"approved_by" gorm:"bigint"`

	Supplier Supplier     `json:"supplier" gorm:"foreignKey:SupplierID"`
	Approver User         `json:"approver" gorm:"foreignKey:ApprovedBy"`
	Items    []SupplyItem `json:"items" gorm:"-"`
}

type SupplyItem struct {
	ID        uint    `json:"id" gorm:"primaryKey"`
	SupplyID  uint    `json:"supply_id" gorm:"bigint"`
	ProductID uint    `json:"product_id" gorm:"bigint"`
	Quantity  int     `json:"quantity" gorm:"int"`
	UnitPrice float64 `json:"unit_price" gorm:"decimal(10,2)"`

	Supply  Supply  `json:"supply" gorm:"foreignKey:SupplyID"`
	Product Product `json:"product" gorm:"foreignKey:ProductID"`
}

type LoginRequest struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type RegisterRequest struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
	Role     string `json:"role" binding:"required"`
}
