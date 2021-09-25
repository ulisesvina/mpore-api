package database

import (
	"fmt"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func GetConnection() *gorm.DB {
	dbConfig, exist := os.LookupEnv("DB_CONFIG")
	fmt.Println((dbConfig))
	// DB_CONFIG FORMAT = host= user= password= dbname= port= sslmode= TimeZone=America/Mexico_City

	if !exist {
		dbConfig = "postgresql://postgres@127.0.0.1:5432/mpore"
		// Using localhost connection if DB_CONFIG is undefined
	}

	db, err := gorm.Open(postgres.Open(dbConfig), &gorm.Config{})

	if err != nil {
		fmt.Println(err)
	}

	return db
}
