package httpserver

import "github.com/gin-gonic/gin"

type HttpServer struct {
	router *gin.Engine
}

func NewServer() *HttpServer {
	return &HttpServer{
		router: gin.Default(),
	}
}

func (server *HttpServer) StartServer() error {
	err := server.router.Run(":8000")
	return err
}
