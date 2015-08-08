#include <stdio.h>      /* printf */
#include <string.h>     /* strcat */
#include <stdlib.h>     /* strtol */

const char *byte_to_binary(int x)
{
    static char b[9];
    b[0] = '\0';

    int z;
    for (z = 128; z > 0; z >>= 1)
    {
        strcat(b, ((x & z) == z) ? "1" : "0");
    }

    return b;
}
void file1(){
    const int len = 10;
    FILE *fp;
    fp=fopen("./bitwise.c", "r+");
    
    for(int i=0;i<len;i++){
        unsigned char x ;
        fread(&x,1,1,fp);
        printf("%s\n", byte_to_binary(x));
        x = ~x;
        printf("%s\n", byte_to_binary(x));
        fseek(fp,-1,SEEK_CUR);
        fwrite(&x, 1, 1, fp);
    }
    fclose(fp);
}
void file3(){
    const int len = 10;
    FILE *fp;
    fp=fopen("./bitwise.c", "r+");
    
    for(int i=0;i<len;i++){
        unsigned char x ;
        printf("ftell:%d\n", ftell(fp));
        fread(&x,1,1,fp);
        printf("ftell:%d\n", ftell(fp));
        printf("%s\n", byte_to_binary(x));
        x = ~x;
        printf("%s\n", byte_to_binary(x));
        int pos = ftell(fp);
        fseek(fp,-1,SEEK_CUR);
        printf("ftell:%d\n", ftell(fp));
        fwrite(&x, 1, 1, fp);
    }
    fclose(fp);
}
void file4(){
    const int len = 10;
    FILE *fp;
    fp=fopen("./bitwise.c", "r+");
    
    for(int i=0;i<len;i++){
        unsigned char x ;
        printf("ftell:%d\n", ftell(fp));
        fread(&x,1,1,fp);
        printf("ftell:%d\n", ftell(fp));
        printf("%s\n", byte_to_binary(x));
        x = ~x;
        printf("%s\n", byte_to_binary(x));
        int pos = ftell(fp);
        fseek(fp,-1,SEEK_CUR);
        printf("ftell:%d\n", ftell(fp));
        // 这里的len必须改为1。！
        fwrite(&x, len, len, fp);
    }
    fclose(fp);
}
void file2(){
    const int len = 1;
    FILE *fp;
    fp=fopen("./bitwise.c", "r+");
    unsigned char x[len];
    fread(x,len,len,fp);
    for(int i=0;i<len;i++){
        printf("%s\n", byte_to_binary(x[i]));
        x[i] = ~x[i];
        printf("%s\n", byte_to_binary(x[i]));
    }
    rewind(fp);
    fwrite(x, len, len, fp);
    fclose(fp);
}
int main(void)
{
    // {
    //     char *tmp;
    //     char *b = "0101";
    //     printf("%d\n", strtol(b, &tmp, 2));
    // }
    // {
    //     printf("%s\n", byte_to_binary(5));
    //     printf("%s\n", byte_to_binary(~5));
    // }
    file1();
    return 0;
}