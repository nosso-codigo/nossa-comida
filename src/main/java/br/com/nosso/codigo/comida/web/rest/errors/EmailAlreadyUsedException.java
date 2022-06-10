package br.com.nosso.codigo.comida.web.rest.errors;

import java.net.URI;

public class EmailAlreadyUsedException extends BadRequestAlertException {

    private static final URI TYPE = URI.create(ErrorConstants.PROBLEM_BASE_URL + "/email-already-used");

    public EmailAlreadyUsedException() {
        super(TYPE, "Email is already in use!", "userManagement", "emailexists");
    }
}
