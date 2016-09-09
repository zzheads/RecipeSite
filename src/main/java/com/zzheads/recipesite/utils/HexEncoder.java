package com.zzheads.recipesite.utils;

/**
 * Created by alexeypapin on 06.09.16.
 */
public class HexEncoder {

    private String encoded;
    private String decoded;

    public HexEncoder(String encoded) {
        this.encoded = encoded;
        this.decoded = toDecimal(encoded);
    }

    public String getEncoded() {
        return encoded;
    }

    public void setEncoded(String encoded) {
        this.encoded = encoded;
    }

    public String getDecoded() {
        return decoded;
    }

    public void setDecoded(String decoded) {
        this.decoded = decoded;
    }

    @Override
    public String toString() {
        return decoded;
    }

    private static String toDecimal (String hexStr) {
        char[] hex = hexStr.toCharArray();
        char current;
        String result = "";
        for (int i=0;i<hex.length;i++) {
            if (hex[i] == '%') {
                current = (char) ((toDecimal(hex[i+1]) * 16) + toDecimal(hex[i+2]));
                i+=2;
            } else {
                if (hex[i] == '+') {
                    current = ' ';
                } else {
                    current = hex[i];
                }
            }
            result += current;
        }
        while (!(result.endsWith("}") || result.endsWith("]"))) {
            result = result.substring(0, result.length()-1);
        }
        return result;
    }

    private static int toDecimal (char hex) {
        switch (hex) {
            case '0': return 0;
            case '1': return 1;
            case '2': return 2;
            case '3': return 3;
            case '4': return 4;
            case '5': return 5;
            case '6': return 6;
            case '7': return 7;
            case '8': return 8;
            case '9': return 9;
            case 'A': return 10;
            case 'B': return 11;
            case 'C': return 12;
            case 'D': return 13;
            case 'E': return 14;
            case 'F': return 15;
        }
        return -1;
    }
}
