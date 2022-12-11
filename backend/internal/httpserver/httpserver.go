package httpserver

import (
	"github.com/gin-gonic/gin"
	"github.com/loveletter4u/cris/internal/controllers"
	"github.com/loveletter4u/cris/internal/storage"
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
	server.Routes()
	err := server.router.Run(":8000")
	server.storage.Close()
	return err
}
func (server *HttpServer) Routes() {
	server.router.GET("/api/author/:id", controllers.GetAuthorById(server.storage))
	server.router.GET("/api/authors", controllers.GetAuthors(server.storage))
}
