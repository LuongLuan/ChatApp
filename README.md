# ChatApp Microservices

## Purpose and Scope

This document provides a comprehensive overview of the ChatApp microservices-based system architecture. The ChatApp is a distributed application built using ASP.NET Core microservices, implementing real-time chat functionality, user management, post sharing, and notifications through a loosely-coupled, event-driven architecture.

# System Architecture Overview

The ChatApp implements a microservices architecture with clear separation of concerns, where each service manages its own data store and communicates through well-defined interfaces.

## High-Level Service Architecture
![image](https://github.com/user-attachments/assets/271f71d4-7877-4d76-ae98-17dae18a9d73)

# Technology Stack Overview
## Database Technologies (Polyglot Persistence)
![image](https://github.com/user-attachments/assets/fac81c5c-9aeb-4c48-a220-6756dc3740ff)

## Core Framework Technologies
ASP.NET Core 6+: Base framework for all services
Entity Framework Core: ORM for SQL Server, PostgreSQL, and MySQL
MongoDB Driver: Direct database access for User.Grpc
MediatR: CQRS implementation in Post.Api and Notification.Api
AutoMapper: Object mapping across services
MassTransit: Event bus abstraction over RabbitMQ
SignalR: Real-time communication in Chat.Api
Duende IdentityServer: OAuth2/OpenID Connect implementation
Ocelot: API Gateway routing and aggregation
Communication Patterns
The system implements multiple communication patterns optimized for different scenarios:

## Synchronous Communication
HTTP REST: External client communication through OcelotApiGw
gRPC: Internal service-to-service calls to User.Grpc
JWT Authentication: Secured endpoints across all services
Asynchronous Communication
RabbitMQ Event Bus: Decoupled service communication using MassTransit
Event Publishing: Post.Api publishes domain events
Event Consumption: Notification.Api and Chat.Api consume events
Real-time Communication
SignalR Hubs: Chat.Api implements PresenceHub and MessageHub
WebSocket Connections: Persistent connections for instant messaging
Presence Tracking: Real-time user status updates
Sources: 
docker-compose.override.yml
67-89

## Deployment Architecture
The system is containerized using Docker with orchestration through Docker Compose:
