package controllers

// @Summary Регистрация нового пользователя
// @Description Создание нового пользователя в системе
// @Tags auth
// @Accept json
// @Produce json
// @Param user body models.RegisterRequest true "Данные пользователя"
// @Success 201 {object} map[string]interface{} "Пользователь зарегистрирован"
// @Failure 400 {object} map[string]interface{} "Ошибка в данных запроса"
// @Failure 500 {object} map[string]interface{} "Внутренняя ошибка сервера"
// @Router /register [post]
func swaggerRegister() {}

// @Summary Вход в систему
// @Description Аутентификация пользователя и получение JWT токена
// @Tags auth
// @Accept json
// @Produce json
// @Param credentials body models.LoginRequest true "Учетные данные"
// @Success 200 {object} map[string]interface{} "Успешная аутентификация с токеном"
// @Failure 400 {object} map[string]interface{} "Ошибка в данных запроса"
// @Failure 401 {object} map[string]interface{} "Неверные учетные данные"
// @Router /login [post]
func swaggerLogin() {}

// @Summary Создание нового товара
// @Description Добавление нового товара в базу данных
// @Tags products
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param product body models.Product true "Данные товара"
// @Success 201 {object} models.Product "Товар создан"
// @Failure 400 {object} map[string]interface{} "Ошибка в данных запроса"
// @Failure 401 {object} map[string]interface{} "Не авторизован"
// @Failure 403 {object} map[string]interface{} "Доступ запрещен"
// @Failure 500 {object} map[string]interface{} "Внутренняя ошибка сервера"
// @Router /products [post]
func swaggerCreateProduct() {}

// @Summary Получение товара по ID
// @Description Получение детальной информации о товаре по его ID
// @Tags products
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param id path int true "ID товара"
// @Success 200 {object} models.Product "Данные товара"
// @Failure 400 {object} map[string]interface{} "Некорректный ID"
// @Failure 401 {object} map[string]interface{} "Не авторизован"
// @Failure 404 {object} map[string]interface{} "Товар не найден"
// @Router /products/{id} [get]
func swaggerGetProduct() {}

// @Summary Получение списка товаров
// @Description Получение списка всех товаров с возможностью фильтрации по отделу или поставщику
// @Tags products
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param department_id query int false "ID отдела"
// @Param supplier_id query int false "ID поставщика"
// @Success 200 {array} models.Product "Список товаров"
// @Failure 401 {object} map[string]interface{} "Не авторизован"
// @Failure 500 {object} map[string]interface{} "Внутренняя ошибка сервера"
// @Router /products [get]
func swaggerGetAllProducts() {}

// @Summary Обновление товара
// @Description Обновление информации о товаре
// @Tags products
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param id path int true "ID товара"
// @Param product body models.Product true "Данные товара"
// @Success 200 {object} models.Product "Товар обновлен"
// @Failure 400 {object} map[string]interface{} "Ошибка в данных запроса"
// @Failure 401 {object} map[string]interface{} "Не авторизован"
// @Failure 403 {object} map[string]interface{} "Доступ запрещен"
// @Failure 500 {object} map[string]interface{} "Внутренняя ошибка сервера"
// @Router /products/{id} [put]
func swaggerUpdateProduct() {}

// @Summary Удаление товара
// @Description Удаление товара из базы данных
// @Tags products
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param id path int true "ID товара"
// @Success 200 {object} map[string]interface{} "Товар удален"
// @Failure 400 {object} map[string]interface{} "Некорректный ID"
// @Failure 401 {object} map[string]interface{} "Не авторизован"
// @Failure 403 {object} map[string]interface{} "Доступ запрещен"
// @Failure 500 {object} map[string]interface{} "Внутренняя ошибка сервера"
// @Router /products/{id} [delete]
func swaggerDeleteProduct() {}

// @Summary Создание отдела
// @Description Добавление нового отдела
// @Tags departments
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param department body models.Department true "Данные отдела"
// @Success 201 {object} models.Department "Отдел создан"
// @Failure 400 {object} map[string]interface{} "Ошибка в данных запроса"
// @Failure 401 {object} map[string]interface{} "Не авторизован"
// @Failure 403 {object} map[string]interface{} "Доступ запрещен"
// @Failure 500 {object} map[string]interface{} "Внутренняя ошибка сервера"
// @Router /departments [post]
func swaggerCreateDepartment() {}

// @Summary Получение отдела по ID
// @Description Получение информации об отделе по ID
// @Tags departments
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param id path int true "ID отдела"
// @Success 200 {object} models.Department "Данные отдела"
// @Failure 400 {object} map[string]interface{} "Некорректный ID"
// @Failure 401 {object} map[string]interface{} "Не авторизован"
// @Failure 404 {object} map[string]interface{} "Отдел не найден"
// @Router /departments/{id} [get]
func swaggerGetDepartment() {}

// @Summary Получение списка отделов
// @Description Получение списка всех отделов
// @Tags departments
// @Accept json
// @Produce json
// @Security BearerAuth
// @Success 200 {array} models.Department "Список отделов"
// @Failure 401 {object} map[string]interface{} "Не авторизован"
// @Failure 500 {object} map[string]interface{} "Внутренняя ошибка сервера"
// @Router /departments [get]
func swaggerGetAllDepartments() {}

// @Summary Обновление отдела
// @Description Обновление информации об отделе
// @Tags departments
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param id path int true "ID отдела"
// @Param department body models.Department true "Данные отдела"
// @Success 200 {object} models.Department "Отдел обновлен"
// @Failure 400 {object} map[string]interface{} "Ошибка в данных запроса"
// @Failure 401 {object} map[string]interface{} "Не авторизован"
// @Failure 403 {object} map[string]interface{} "Доступ запрещен"
// @Failure 500 {object} map[string]interface{} "Внутренняя ошибка сервера"
// @Router /departments/{id} [put]
func swaggerUpdateDepartment() {}

// @Summary Удаление отдела
// @Description Удаление отдела из базы данных
// @Tags departments
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param id path int true "ID отдела"
// @Success 200 {object} map[string]interface{} "Отдел удален"
// @Failure 400 {object} map[string]interface{} "Некорректный ID"
// @Failure 401 {object} map[string]interface{} "Не авторизован"
// @Failure 403 {object} map[string]interface{} "Доступ запрещен"
// @Failure 500 {object} map[string]interface{} "Внутренняя ошибка сервера"
// @Router /departments/{id} [delete]
func swaggerDeleteDepartment() {}

// @Summary Создание поставщика
// @Description Добавление нового поставщика
// @Tags suppliers
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param supplier body models.Supplier true "Данные поставщика"
// @Success 201 {object} models.Supplier "Поставщик создан"
// @Failure 400 {object} map[string]interface{} "Ошибка в данных запроса"
// @Failure 401 {object} map[string]interface{} "Не авторизован"
// @Failure 403 {object} map[string]interface{} "Доступ запрещен"
// @Failure 500 {object} map[string]interface{} "Внутренняя ошибка сервера"
// @Router /suppliers [post]
func swaggerCreateSupplier() {}

// @Summary Получение поставщика по ID
// @Description Получение информации о поставщике по ID
// @Tags suppliers
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param id path int true "ID поставщика"
// @Success 200 {object} models.Supplier "Данные поставщика"
// @Failure 400 {object} map[string]interface{} "Некорректный ID"
// @Failure 401 {object} map[string]interface{} "Не авторизован"
// @Failure 404 {object} map[string]interface{} "Поставщик не найден"
// @Router /suppliers/{id} [get]
func swaggerGetSupplier() {}

// @Summary Получение списка поставщиков
// @Description Получение списка всех поставщиков
// @Tags suppliers
// @Accept json
// @Produce json
// @Security BearerAuth
// @Success 200 {array} models.Supplier "Список поставщиков"
// @Failure 401 {object} map[string]interface{} "Не авторизован"
// @Failure 500 {object} map[string]interface{} "Внутренняя ошибка сервера"
// @Router /suppliers [get]
func swaggerGetAllSuppliers() {}

// @Summary Обновление поставщика
// @Description Обновление информации о поставщике
// @Tags suppliers
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param id path int true "ID поставщика"
// @Param supplier body models.Supplier true "Данные поставщика"
// @Success 200 {object} models.Supplier "Поставщик обновлен"
// @Failure 400 {object} map[string]interface{} "Ошибка в данных запроса"
// @Failure 401 {object} map[string]interface{} "Не авторизован"
// @Failure 403 {object} map[string]interface{} "Доступ запрещен"
// @Failure 500 {object} map[string]interface{} "Внутренняя ошибка сервера"
// @Router /suppliers/{id} [put]
func swaggerUpdateSupplier() {}

// @Summary Удаление поставщика
// @Description Удаление поставщика из базы данных
// @Tags suppliers
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param id path int true "ID поставщика"
// @Success 200 {object} map[string]interface{} "Поставщик удален"
// @Failure 400 {object} map[string]interface{} "Некорректный ID"
// @Failure 401 {object} map[string]interface{} "Не авторизован"
// @Failure 403 {object} map[string]interface{} "Доступ запрещен"
// @Failure 500 {object} map[string]interface{} "Внутренняя ошибка сервера"
// @Router /suppliers/{id} [delete]
func swaggerDeleteSupplier() {}

// @Summary Создание продажи
// @Description Регистрация новой продажи
// @Tags sales
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param sale body models.Sale true "Данные продажи"
// @Success 201 {object} models.Sale "Продажа зарегистрирована"
// @Failure 400 {object} map[string]interface{} "Ошибка в данных запроса"
// @Failure 401 {object} map[string]interface{} "Не авторизован"
// @Failure 403 {object} map[string]interface{} "Доступ запрещен"
// @Failure 500 {object} map[string]interface{} "Внутренняя ошибка сервера"
// @Router /sales [post]
func swaggerCreateSale() {}

// @Summary Получение продажи по ID
// @Description Получение информации о продаже по ID
// @Tags sales
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param id path int true "ID продажи"
// @Success 200 {object} models.Sale "Данные продажи"
// @Failure 400 {object} map[string]interface{} "Некорректный ID"
// @Failure 401 {object} map[string]interface{} "Не авторизован"
// @Failure 403 {object} map[string]interface{} "Доступ запрещен"
// @Failure 404 {object} map[string]interface{} "Продажа не найдена"
// @Router /sales/{id} [get]
func swaggerGetSale() {}

// @Summary Получение списка продаж
// @Description Получение списка всех продаж с возможностью фильтрации по дате
// @Tags sales
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param start_date query string false "Начальная дата (YYYY-MM-DD)"
// @Param end_date query string false "Конечная дата (YYYY-MM-DD)"
// @Success 200 {array} models.Sale "Список продаж"
// @Failure 401 {object} map[string]interface{} "Не авторизован"
// @Failure 403 {object} map[string]interface{} "Доступ запрещен"
// @Failure 500 {object} map[string]interface{} "Внутренняя ошибка сервера"
// @Router /sales [get]
func swaggerGetAllSales() {}

// @Summary Создание поставки
// @Description Регистрация новой поставки с товарами
// @Tags supplies
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param supply body object true "Данные поставки с товарами"
// @Success 201 {object} models.Supply "Поставка зарегистрирована"
// @Failure 400 {object} map[string]interface{} "Ошибка в данных запроса"
// @Failure 401 {object} map[string]interface{} "Не авторизован"
// @Failure 403 {object} map[string]interface{} "Доступ запрещен"
// @Failure 500 {object} map[string]interface{} "Внутренняя ошибка сервера"
// @Router /supplies [post]
func swaggerCreateSupply() {}

// @Summary Получение поставки по ID
// @Description Получение информации о поставке по ID
// @Tags supplies
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param id path int true "ID поставки"
// @Success 200 {object} models.Supply "Данные поставки"
// @Failure 400 {object} map[string]interface{} "Некорректный ID"
// @Failure 401 {object} map[string]interface{} "Не авторизован"
// @Failure 403 {object} map[string]interface{} "Доступ запрещен"
// @Failure 404 {object} map[string]interface{} "Поставка не найдена"
// @Router /supplies/{id} [get]
func swaggerGetSupply() {}

// @Summary Получение списка поставок
// @Description Получение списка всех поставок
// @Tags supplies
// @Accept json
// @Produce json
// @Security BearerAuth
// @Success 200 {array} models.Supply "Список поставок"
// @Failure 401 {object} map[string]interface{} "Не авторизован"
// @Failure 403 {object} map[string]interface{} "Доступ запрещен"
// @Failure 500 {object} map[string]interface{} "Внутренняя ошибка сервера"
// @Router /supplies [get]
func swaggerGetAllSupplies() {}

// @Summary Получение товаров с низким запасом
// @Description Получение списка товаров, количество которых меньше или равно минимальному порогу
// @Tags analytics
// @Accept json
// @Produce json
// @Security BearerAuth
// @Success 200 {array} models.Product "Список товаров с низким запасом"
// @Failure 401 {object} map[string]interface{} "Не авторизован"
// @Failure 403 {object} map[string]interface{} "Доступ запрещен"
// @Failure 500 {object} map[string]interface{} "Внутренняя ошибка сервера"
// @Router /analytics/low-stock [get]
func swaggerGetLowStockProducts() {}

// @Summary Аналитика продаж по периоду
// @Description Получение аналитики продаж за указанный период
// @Tags analytics
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param start_date query string true "Начальная дата (YYYY-MM-DD)"
// @Param end_date query string true "Конечная дата (YYYY-MM-DD)"
// @Success 200 {object} map[string]interface{} "Аналитика продаж"
// @Failure 400 {object} map[string]interface{} "Отсутствуют обязательные параметры"
// @Failure 401 {object} map[string]interface{} "Не авторизован"
// @Failure 403 {object} map[string]interface{} "Доступ запрещен"
// @Failure 500 {object} map[string]interface{} "Внутренняя ошибка сервера"
// @Router /analytics/sales [get]
func swaggerGetSalesByPeriod() {}
