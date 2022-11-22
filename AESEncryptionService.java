package com.example.publicplace.services;

import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.stereotype.Service;

import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.security.spec.AlgorithmParameterSpec;
import java.util.Base64;

@Service
public class AESEncryptionService {
  private static final String ALGORITHM = "AES/GCM/NoPadding";
  private final SecureRandom secureRandom = new SecureRandom();
  private final static int GCM_IV_LENGTH = 12;
  private final static int GCM_TAG_LENGTH = 128;
  private SecretKey secretKey;
  private byte[] associatedData;

  public AESEncryptionService() throws Exception {
    // with every restart this key will be reseted.
    // create new random key
    byte[] key = new byte[16];
    secureRandom.nextBytes(key);
    secretKey = new SecretKeySpec(key, "AES");
    // meta data we want want to verify with the secret message
    associatedData = "ProtocolVersion1".getBytes(StandardCharsets.UTF_8);

  }

  public String encrypt(String plaintext) throws Exception {

    byte[] iv = new byte[GCM_IV_LENGTH]; // NEVER REUSE THIS IV WITH SAME KEY
    secureRandom.nextBytes(iv);
    final Cipher cipher = Cipher.getInstance(ALGORITHM);
    GCMParameterSpec parameterSpec = new GCMParameterSpec(GCM_TAG_LENGTH, iv); // 128 bit auth tag length
    cipher.init(Cipher.ENCRYPT_MODE, secretKey, parameterSpec);

    if (associatedData != null) {
      cipher.updateAAD(associatedData);
    }

    byte[] cipherText = cipher.doFinal(plaintext.getBytes(StandardCharsets.UTF_8));

    ByteBuffer byteBuffer = ByteBuffer.allocate(iv.length + cipherText.length);
    byteBuffer.put(iv);
    byteBuffer.put(cipherText);
    return Base64.getEncoder().encodeToString(byteBuffer.array());
  }

  /**
   * @param encoded
   * @return
   * @throws Exception
   */
  public String decrypt(String encoded) throws Exception {
    byte[] cipherMessage = Base64.getDecoder().decode(encoded);
    final Cipher cipher = Cipher.getInstance(ALGORITHM);
    // use first 12 bytes for iv
    AlgorithmParameterSpec gcmIv = new GCMParameterSpec(GCM_TAG_LENGTH, cipherMessage, 0, GCM_IV_LENGTH);
    cipher.init(Cipher.DECRYPT_MODE, secretKey, gcmIv);

    if (associatedData != null) {
      cipher.updateAAD(associatedData);
    }
    // use everything from 12 bytes on as ciphertext
    byte[] plainText = cipher.doFinal(cipherMessage, GCM_IV_LENGTH, cipherMessage.length - GCM_IV_LENGTH);

    return new String(plainText, StandardCharsets.UTF_8);
  }
}
