package httpserver

import (
	"github.com/gin-gonic/gin"
	"github.com/loveletter4u/cris/internal/controllers"
	"github.com/loveletter4u/cris/internal/filldb"
	"github.com/loveletter4u/cris/internal/storage"
	"os"
)

//Сервер

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
	//метод запуска сервера, здесь подключаем бд, заполняем ее, задаем роуты и запускаем сервер на 8000 порте
	if err := server.storage.Open(); err != nil {
		return err
	}
	file, err := os.Open("/backend/resources/authors.csv")
	if err != nil {
		return err
	}
	err = filldb.AuthorsFill(file, server.storage)
	if err != nil {
		return err
	}
	err = filldb.PublicationFill(server.storage)
	if err != nil {
		return err
	}
	server.Routes()
	err = server.router.Run(":8000")
	server.storage.Close()
	return err
}
func (server *HttpServer) Routes() {
	//Здесь прописываем роуты
	api := server.router.Group("/api")
	api.GET("/authors", controllers.GetAuthors(server.storage))
	api.GET("/author/:id", controllers.GetAuthorById(server.storage))
	api.GET("/author/:id/publications", controllers.GetAuthorPublications(server.storage))
	api.GET("/publications", controllers.GetPublications(server.storage))
	api.GET("/publications/types", controllers.GetPublicationsType(server.storage))
	api.GET("/publication/:id", controllers.GetPublication(server.storage))
	api.GET("/publication/:id/authors", controllers.GetPublicationAuthors(server.storage))
}
