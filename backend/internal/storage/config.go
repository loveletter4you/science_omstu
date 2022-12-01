package storage

type Config struct {
	DataBaseURL string
}

func NewConfig() *Config {
	return &Config{
		//connect to without docker
		DataBaseURL: "user=postgres password=postgres host=0.0.0.0 port=5436 dbname=postgres sslmode=disable",
	}
}
