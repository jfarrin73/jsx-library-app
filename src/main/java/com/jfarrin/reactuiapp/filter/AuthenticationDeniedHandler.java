package com.jfarrin.reactuiapp.filter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jfarrin.reactuiapp.constant.SecurityConstant;
import com.jfarrin.reactuiapp.model.HttpResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;


@Component
public class AuthenticationDeniedHandler implements AuthenticationEntryPoint {
    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException arg2) throws IOException {
        HttpResponse httpResponse = new HttpResponse(
                HttpStatus.UNAUTHORIZED.value(),
                HttpStatus.UNAUTHORIZED,
                "No Authentication",
                SecurityConstant.UNAUTHENTICATED_MESSAGE);

        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setStatus(HttpStatus.UNAUTHORIZED.value());

        ObjectMapper mapper = new ObjectMapper();
        mapper.writeValue(response.getOutputStream(), httpResponse); //serialize httpResponse into response
    }
}