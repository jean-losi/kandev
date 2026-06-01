#include <stdio.h>
#include <stdlib.h>

unsigned long long fib(unsigned int n) {
    unsigned long long a = 0, b = 1;
    for (unsigned int i = 0; i < n; i++) {
        unsigned long long t = a + b;
        a = b;
        b = t;
    }
    return a;
}

int main(int argc, char **argv) {
    unsigned int n = (argc > 1) ? (unsigned int)strtoul(argv[1], NULL, 10) : 10;
    printf("%llu\n", fib(n));
    return 0;
}
