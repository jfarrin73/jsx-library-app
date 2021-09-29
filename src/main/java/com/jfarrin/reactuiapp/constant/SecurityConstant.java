package com.jfarrin.reactuiapp.constant;

public class SecurityConstant {
    public static final long EXPIRATION_TIME = 432_000_000; // 5 DAYS in milliseconds
    public static final String TOKEN_PREFIX = "Bearer ";
    public static final String JWT_TOKEN_HEADER = "Jwt-Token"; // This is a typical naming convention for Token Headers
    public static final String TOKEN_CANNOT_BE_VERIFIED = "Token cannot be verified";
    public static final String GET_SDS_LLC = "SDS, LLC";
    public static final String GET_SDS_ADMINISTRATION = "SDS Portal";
    public static final String AUTHORITIES = "authorities";
    public static final String FORBIDDEN_MESSAGE = "You need to log in to access this page";
    public static final String ACCESS_DENIED_MESSAGE = "You do not have permission to access this page";
    public static final String UNAUTHENTICATED_MESSAGE = "You need to log in to access this page";
    public static final String OPTIONS_HTTP_METHOD = "OPTIONS";
    public static final String[] PUBLIC_URLS = { "/user/login", "/user/register", "/user/resetpassword/**", "/entries/public" };
//    public static final String[] PUBLIC_URLS = { "**" }; // Allow any for testing
}
