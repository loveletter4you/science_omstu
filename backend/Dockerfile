FROM golang:1.19.3-alpine AS base

WORKDIR /backend
COPY go.mod .
COPY go.sum .
RUN go mod download
COPY . .
RUN go build -o /main ./cmd/httpserver/httpserver.go
ENTRYPOINT ["/main"]
