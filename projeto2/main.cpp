#include <iostream>


#include "opencv2/core/core.hpp"

#include "opencv2/imgproc/imgproc.hpp"

#include "opencv2/highgui/highgui.hpp"


#include <dirent.h>

using namespace cv;
using namespace std;

Mat imagemOriginal, imagemAlterada;

int readImage() {
    imagemOriginal = NULL;
    do {
        printf("\n-------------------------------------------\n");
        printf("1 - Verificar imagens existentes.\n");
        printf("2 - Sair.\n");
        printf("3 - Escolher imagem.\n");
        printf("Opção: ");
        printf("\n-------------------------------------------\n");

        string op;
        bool existe = true;
        cin >> op;
        if (!op.compare("1")) {
            DIR *dir;
            struct dirent *ent;
            if ((dir = opendir ("../imagens")) != NULL) {
                /* print all the files and directories within directory */
                while ((ent = readdir (dir)) != NULL) {
                    printf ("%s\n", ent->d_name);
                }
                closedir (dir);
            } else {
                /* could not open directory */
                perror ("");
                return EXIT_FAILURE;
            }
        }
        else if (!op.compare("2")) {
                destroyAllWindows();
                return 1;
        }

        else{
            if (!op.compare("3")) {
                string imagem;
                printf("\n-------------------------------------------\n");
                printf("Nome da imagem:\n");
                cin >> imagem;
                printf("\n-------------------------------------------\n");


                imagem = "../imagens/" + imagem;

                imagemOriginal = cv::imread(imagem, CV_LOAD_IMAGE_UNCHANGED);

                if (!imagemOriginal.data) {
                    cout << "Ficheiro nao foi aberto ou localizado !!" << endl;
                    existe = false;
                }
            }
        }
    } while (!imagemOriginal.data);

    namedWindow("Imagem Original", CV_WINDOW_AUTOSIZE);


    imshow("Imagem Original", imagemOriginal);


    return 0;
}
void menu() {
    printf("\n--------------------MENU-------------------\n");
    printf("1 - Imagem com Blur.\n");
    printf("0 - Sair.\n");
    printf("\n-------------------------------------------\n");
}

void blur() {
    imagemAlterada = imagemOriginal.clone();
    medianBlur(imagemOriginal, imagemAlterada, 5);
    namedWindow("Imagem com Blur", CV_WINDOW_AUTOSIZE);
    imshow("Imagem com Blur", imagemAlterada);
}

int main( int argc, char** argv )
{
    readImage();
    int op;

    while(true){
        menu();
        cin >> op;

        switch (op){
            case 1:
                blur();
                waitKey(0);
                break;
            default:
                printf("\nSelecione um número válida!");
                break;
        }

    }

    destroyAllWindows();
    return 0;

}
