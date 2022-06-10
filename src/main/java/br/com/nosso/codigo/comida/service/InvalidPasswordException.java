package br.com.nosso.codigo.comida.service;

import static javax.ws.rs.core.Response.Status.BAD_REQUEST;

import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response;

public class InvalidPasswordException extends RuntimeException {}
