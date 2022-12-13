package httpserver

import (
	"github.com/gin-gonic/gin"
	"github.com/loveletter4u/cris/internal/controllers"
	"github.com/loveletter4u/cris/internal/filldb"
	"github.com/loveletter4u/cris/internal/storage"
	"os"
)

type HttpServer struct {
	router  *gin.Engine
	storage *storage.Storage
}

func NewServer() *HttpServer {
	return &HttpServer{
		storage: storage.NewStorage(storage.NewConfig()),
		router:  gin.Default(),
	}
}

func (server *HttpServer) StartServer() error {
	if err := server.storage.Open(); err != nil {
		return err
	}
	file, err := os.Open("/backend/resources/authors.csv")
	if err != nil {
		return err
	}
	filldb.AuthorsFill(file, server.storage)
	server.Routes()
	err = server.router.Run(":8000")
	server.storage.Close()
	return err
}
func (server *HttpServer) Routes() {
	api := server.router.Group("/api")
	api.GET("/author/:id", controllers.GetAuthorById(server.storage))
	api.GET("/authors", controllers.GetAuthors(server.storage))
}
