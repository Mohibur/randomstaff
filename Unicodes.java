public class Unicodes {
  public static long utf8ToUnicode(byte[] b) {
    if ((b[0] & 0xF0) == 0xF0) { // b'1110xxxx
      if (b.length == 4) {
        return ((b[0] & 0x07) << 18) + ((b[1] & 0x3F) << 12) + ((b[2] & 0x3F) << 6) + (b[3] & 0x3F);
      }
    } else if ((b[0] & 0xE0) == 0xE0) { // b'110xxxxx
      if (b.length == 3) {
        return ((b[0] & 0x0F) << 12) + ((b[1] & 0x3F) << 6) + (b[2] & 0x3F);
      }
    } else if ((b[0] & 0xC0) == 0xC0) { // b'10xxxxxx
      if (b.length == 2) {
        return ((b[0] & 0x1F) << 6) + (b[1] & 0x3F);
      }
    } else if ((b[0] & 0x80) == 0) { // b'0xxxxxxx
      if (b.length == 1) {
        return b[0];
      }
    }
    throw new RuntimeException("Invalid UTF-8 Character code");
  }

  public static byte[] unicodeToUtf8(long l) {
    if (l >= 0x0000 && l <= 0x007F) {
      return new byte[] { (byte) l };
    } else if (l >= 0x0080 && l <= 0x07FF) {
      byte b[] = new byte[2];
      b[1] = (byte) ((l & 0x3F) + 0x80);
      b[0] = (byte) ((l >> 6) + 0xC0);
      return b;
    } else if (l >= 0x0800 && l <= 0xFFFF) {
      byte b[] = new byte[3];
      b[2] = (byte) ((l & 0x3F) + 0x80);
      l = l >> 6;
      b[1] = (byte) ((l & 0x3F) + 0x80);
      b[0] = (byte) ((l >> 6) + 0xE0);
      return b;

    } else if (l >= 0x10000 && l <= 0x10FFFF) {
      byte b[] = new byte[4];
      b[3] = (byte) ((l & 0x3F) + 0x80);
      l = l >> 6;
      b[2] = (byte) ((l & 0x3F) + 0x80);
      l = l >> 6;
      b[1] = (byte) ((l & 0x3F) + 0x80);
      b[0] = (byte) ((l >> 6) + 0xF0);
      return b;
    }
    return null;
  }
}
