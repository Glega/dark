package util;

import org.apache.commons.codec.digest.DigestUtils;

/**
 * Created by Worker2 on 19.12.2017.
 */
public class MD5Util {


    static public String MD5Hash(String s){
        String md5Hex = DigestUtils.md5Hex(s);
        return md5Hex;

    }

}
