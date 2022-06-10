package br.com.nosso.codigo.comida.web.rest.errors;

import java.net.URI;

public class InvalidPasswordWebException extends BadRequestAlertException {

    public static final URI TYPE = URI.create(ErrorConstants.PROBLEM_BASE_URL + "/invalid-password");

    public InvalidPasswordWebException() {
        super(TYPE, "Incorrect Password!", "userManagement", "incorrectpassword");
    }
}
