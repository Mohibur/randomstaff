import java.util.*;
// Online Java Compiler
// Use this editor to write, compile and run your Java code online
public class Combination {
    public static <T> void permutation(List<T[]> output, T[] elements, int n) {
        if(n == 1) {
            output.add(Arrays.copyOf(elements, elements.length));
            return;
        }
        for(int i = 0; i < n-1; i++) {
            permutation(output, elements, n - 1);
            if(n % 2 == 0) {
                swap(elements, i, n-1);
            } else {
                swap(elements, 0, n-1);
            }
        }
        permutation(output, elements, n - 1);
    }
    public static <T> void swap(T[] elements, int a, int b) {
        T t = elements[a];
        elements[a] = elements[b];
        elements[b] = t;
    }
    public static void main(String[] args) {
        List<Integer[]> l = new ArrayList<Integer[]>();
        permutation(l, new Integer[]{1, 2, 3}, 3);
        
        for(Integer []ll:l) {
          System.out.println(ll[0] + "," + ll[1] + ", " + ll [2]);
        }
    }
}
