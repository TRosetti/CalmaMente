package com.calmamente.backend.exception;

/* 
Esta é uma exceção de Runtime para que o Spring não force o tratamento (try/catch)
em todas as camadas, deixando-o para o Controller (Global Handler) tratar.
*/
public class RegraNegocioException extends RuntimeException {
    public RegraNegocioException(String message) {
        super(message);
    }
}