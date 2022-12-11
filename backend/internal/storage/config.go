package storage

import "fmt"

type Config struct {
	DataBaseURL string
}

func NewConfig() *Config {
	return &Config{
		//connect to db without docker
		//DataBaseURL: "user=postgres password=postgres host=0.0.0.0 port=5436 dbname=postgres sslmode=disable",
		//connect to db with docker
		DataBaseURL: fmt.Sprintf("postgres://%s:%s@%s:%s/%s?sslmode=disable",
			"postgres", "postgres", "db", "5432", "postgres"),
	}
}

func LocalConfig() *Config {
	return &Config{
		//connect to db without docker
		DataBaseURL: "user=postgres password=postgres host=0.0.0.0 port=5436 dbname=postgres sslmode=disable",
		//connect to db with docker
		//DataBaseURL: fmt.Sprintf("postgres://%s:%s@%s:%s/%s?sslmode=disable",
		//	"postgres", "postgres", "db", "5432", "postgres"),
	}
}