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
                printf("Nome da imagem:");
                printf("\n-------------------------------------------\n");
                cin >> imagem;

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
    printf("2 - Rotação à direita.\n");
    printf("3 - Rotação à esquerda.\n");
    printf("4 - Alteração uniforme das dimensões.\n");
    printf("0 - Sair.\n");
    printf("Opção: ");
    printf("\n-------------------------------------------\n");
}

void blur() {
    medianBlur(imagemOriginal, imagemAlterada, 5);
    namedWindow("Imagem com Blur", CV_WINDOW_AUTOSIZE);
    imshow("Imagem com Blur", imagemAlterada);
}

void rodarDireita(int angle){
    Mat matRot;
    //obter matriz de rotação
    matRot = getRotationMatrix2D(Point(imagemAlterada.rows / 2, imagemAlterada.cols / 2), angle, 1);
    //aplica a matriz rotação à imagem
    warpAffine(imagemOriginal, imagemAlterada, matRot, imagemOriginal.size());
    namedWindow("Imagem Rodada direita", CV_WINDOW_AUTOSIZE);
    imshow("Imagem Rodada direita", imagemAlterada);
}

void rodarEsquerda(int angle){
    Mat matRot;
    //obter matriz de rotação
    matRot = getRotationMatrix2D(Point(imagemAlterada.rows / 2, imagemAlterada.cols / 2), angle, 1);
    //aplica a matriz rotação à imagem
    warpAffine(imagemOriginal, imagemAlterada, matRot, imagemOriginal.size());
    namedWindow("Imagem Rodada Esquerda", CV_WINDOW_AUTOSIZE);
    imshow("Imagem Rodada Esquerda", imagemAlterada);
}

void resizeUniform(int valor){
    resize(imagemOriginal, imagemAlterada, Size((imagemOriginal.size().width * valor) / 100, (imagemOriginal.size().height * valor) / 100));
    namedWindow("Resize Uniforme", CV_WINDOW_AUTOSIZE);
    imshow("Resize Uniforme", imagemAlterada);
}

int main( int argc, char** argv )
{
    readImage();
    int op;
    int valor;

    while(true){
        menu();
        cin >> op;

        switch (op){
            case 1:
                blur();
                waitKey(25);
                break;
            case 2:
                printf("Qual o valor da rotação? ");
                cin >> valor;
                rodarDireita(valor);
                waitKey(25);
                break;
            case 3:
                printf("Qual o valor da rotação? ");
                cin >> valor;
                rodarEsquerda(-valor);
                waitKey(25);
                break;
            case 4:
                printf("Introduza a percentagem: ");
                cin >> valor;
                resizeUniform(valor);
                waitKey(25);
                break;
            case 0:
                destroyAllWindows();
                return 0;
            default:
                printf("\nSelecione um número válido!");
                break;
        }


    }

    destroyAllWindows();
    return 0;

}
