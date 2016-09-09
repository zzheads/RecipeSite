package com.zzheads.recipesite.utils;

import java.io.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by alexeypapin on 08.09.16.
 */
public class NoPhoto {
    private final byte[] IMAGE;
    private static final String FILE_NAME = "src/main/resources/static/assets/images/no_photo.png";

    public NoPhoto() throws IOException {
        File imgPath = new File(FILE_NAME);
        int size = (int) imgPath.length();

        IMAGE = new byte[size];
        InputStream fis = new BufferedInputStream(new FileInputStream(imgPath));
        for (int i=0;i<size;i++) {
            IMAGE[i] = (byte) fis.read();
        }
    }

    public byte[] getIMAGE() {
        return IMAGE;
    }
}
