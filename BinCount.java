public class BinCount {
	private final int EIGHT_BIT_MAX = 256;
	private final int[] arr = new int[EIGHT_BIT_MAX];

	public BinCount() {
		int curlen = 1;
		while (curlen < EIGHT_BIT_MAX) {
			updateArray(curlen);
			curlen *= 2;
		}
	}

	private void updateArray(int currLen) {
		for (int i = currLen; i < currLen * 2; i++) {
			arr[i] = arr[i - currLen] + 1;
		}
	}

	public String binary8Pad(int i) {
		byte[] r = new byte[] { 0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30 };
		int j = 7;
		while (true) {
			r[j] = (byte) ((i % 2) + 0x30);
			i = i / 2;
			j--;
			if (i == 0)
				break;
		}
		return new String(r);
	}
}
