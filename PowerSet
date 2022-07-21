public class PowerSet {     
    static void printPowerSet(int []set, int set_size) {
        long pow_set_size = (long) Math.pow(2, set_size);
        int counter, j;
        for(counter = 0; counter < pow_set_size; counter++) {
            for(j = 0; j < set_size; j++) {
                if((counter & (1 << j)) > 0) {
                    System.out.print(set[j]);
                }
            }
            System.out.println();
        }
    }
}
