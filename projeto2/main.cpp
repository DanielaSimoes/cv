#include <iostream>


#include "opencv2/core/core.hpp"

#include "opencv2/imgproc/imgproc.hpp"

#include "opencv2/highgui/highgui.hpp"

#include "opencv2/photo.hpp"


#include <dirent.h>

using namespace cv;
using namespace std;

Mat imagemOriginal, imagemAlterada;

int alpha_slider = 0;

int readImage() {
    imagemOriginal = NULL;
    do {
        printf("\n-------------------------------------------\n");
        printf("1 - Verificar imagens existentes.\n");
        printf("2 - Sair.\n");
        printf("3 - Escolher imagem.\n");
        printf("Opção: ");


        string op;
        bool existe = true;
        cin >> op;
        printf("-------------------------------------------\n");
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
                printf("Nome da imagem: ");

                cin >> imagem;
                printf("-------------------------------------------\n");
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
    printf("5 - Alteração não-uniforme das dimensões.\n");
    printf("6 - Transformação Afim.\n");
    printf("7 - Dilatação da Imagem.\n");
    printf("8 - Erosão da Imagem.\n");
    printf("9 - Adicionar moldura de cor.\n");
    printf("10 - Adicionar moldura pixelada.\n");
    printf("11 - Colocar imagem a preto e branco.\n");
    printf("12 - Inverter Preto e Branco.\n");
    printf("13 - Colocar imagem em forma de pintura.\n");
    printf("14 - Evidenciar Detalhes.\n");
    printf("0 - Sair.\n");
    printf("Opção: ");
}


//blur
void blur() {
    medianBlur(imagemOriginal, imagemAlterada, 5);
    namedWindow("Imagem com Blur", CV_WINDOW_AUTOSIZE);
    imshow("Imagem com Blur", imagemAlterada);
}


//rodar imagem à direita
void rodarDireita(int angle){
    Mat matRot;
    //obter matriz de rotação
    matRot = getRotationMatrix2D(Point(imagemAlterada.rows / 2, imagemAlterada.cols / 2), angle, 1);
    //aplica a matriz rotação à imagem
    warpAffine(imagemOriginal, imagemAlterada, matRot, imagemOriginal.size());
    namedWindow("Imagem Rodada direita", CV_WINDOW_AUTOSIZE);
    imshow("Imagem Rodada direita", imagemAlterada);
}

//rodar imagem à esquerda
void rodarEsquerda(int angle){
    Mat matRot;
    //obter matriz de rotação
    matRot = getRotationMatrix2D(Point(imagemAlterada.rows / 2, imagemAlterada.cols / 2), angle, 1);
    //aplica a matriz rotação à imagem
    warpAffine(imagemOriginal, imagemAlterada, matRot, imagemOriginal.size());
    namedWindow("Imagem Rodada Esquerda", CV_WINDOW_AUTOSIZE);
    imshow("Imagem Rodada Esquerda", imagemAlterada);
}


//resize Uniforme
void resizeUniform(int valor){
    resize(imagemOriginal, imagemAlterada, Size((imagemOriginal.size().width * valor) / 100, (imagemOriginal.size().height * valor) / 100));
    namedWindow("Resize Uniforme", CV_WINDOW_AUTOSIZE);
    imshow("Resize Uniforme", imagemAlterada);
}


//resize não uniforme
void resizeNotUniform(int largura, int altura){
    resize(imagemOriginal, imagemAlterada, Size(largura,altura));
    namedWindow("Resize Não Uniforme", CV_WINDOW_AUTOSIZE);
    imshow("Resize Não Uniforme", imagemAlterada);
}


//transformação afim
void transformacaoAfim(){
    Point2f src[3];
    Point2f dst[3];
    Mat matTrans;

    src[0] = Point2f(0,0);
    src[1] = Point2f(imagemOriginal.cols-1, 0);
    src[2] = Point2f(0, imagemOriginal.rows-1);

    dst[0] = Point2f(imagemOriginal.cols*(float)0.0, imagemOriginal.rows*(float)0.35);
    dst[1] = Point2f(imagemOriginal.cols*(float)0.85, imagemOriginal.rows*(float)0.25);
    dst[2] = Point2f(imagemOriginal.cols*(float)0.15, imagemOriginal.rows*(float)0.7);

    matTrans = getAffineTransform(src, dst);
    warpAffine( imagemOriginal, imagemAlterada, matTrans, imagemAlterada.size());

    namedWindow("Transformação Afim", CV_WINDOW_AUTOSIZE);
    imshow("Transformação Afim", imagemAlterada);
}


//trackbar para dilatação
void on_trackbarDilate( int, void* )
{
    Mat element;
    element = getStructuringElement(MORPH_ELLIPSE, Size(3,3));
    dilate(imagemOriginal, imagemAlterada, element, Point(-1,-1), alpha_slider);

    imshow("Dilatação da Imagem", imagemAlterada);
}

//dilatação
void dilateImg(){
    namedWindow("Dilatação da Imagem", CV_WINDOW_AUTOSIZE);

    char TrackbarName[50];
    sprintf(TrackbarName, "iteracoes:\n");

    createTrackbar(TrackbarName, "Dilatação da Imagem", &alpha_slider, 10, on_trackbarDilate);

    on_trackbarDilate(alpha_slider, 0);

}


//erosão
void erodeImg(int iteracao){
    Mat element;
    element = getStructuringElement(MORPH_ELLIPSE, Size(3,3));
    erode(imagemOriginal, imagemAlterada, element, Point(-1,-1), iteracao);

    namedWindow("Erosão da Imagem", CV_WINDOW_AUTOSIZE);
    imshow("Erosão da Imagem", imagemAlterada);
}


//adicionar moldura à imagem
void moldura(bool border){
    int top, bottom, left, right;
    Scalar value;
    RNG rng(12345);
    top = (int) (0.1 * imagemOriginal.rows);
    bottom = (int) (0.1 * imagemOriginal.rows);
    left = (int) (0.1 * imagemOriginal.cols);
    right = (int) (0.1 * imagemOriginal.cols);
    //fazer o random da cor
    value = Scalar(rng.uniform(0, 255), rng.uniform(0, 255), rng.uniform(0, 255));

    if (border)
        copyMakeBorder(imagemOriginal, imagemAlterada, top, bottom, left, right, BORDER_CONSTANT, value);
    else
        copyMakeBorder(imagemOriginal, imagemAlterada, top, bottom, left, right, BORDER_REPLICATE, value);

    namedWindow("Imagem com Moldura", CV_WINDOW_AUTOSIZE);
    imshow("Imagem com Moldura", imagemAlterada);
}


//tornar a imagem a preto e branco
void blackAndWhite(){
    //RBG
    if (imagemOriginal.channels() == 3) {
        cvtColor(imagemOriginal, imagemAlterada, CV_RGB2GRAY);

        namedWindow("Imagem a Preto e Branco", CV_WINDOW_AUTOSIZE);
        imshow("Imagem a Preto e Branco", imagemAlterada);
    }
    //RGBA
    else if (imagemOriginal.channels() == 4) {
        cvtColor(imagemOriginal, imagemAlterada, CV_RGBA2GRAY);

        namedWindow("Imagem a Preto e Branco", CV_WINDOW_AUTOSIZE);
        imshow("Imagem a Preto e Branco", imagemAlterada);
    }
    //BLACK AND WHITE
    else
        printf("\n Escolha uma imagem a cores!\n");
}

//inverter preto e branco da imagem
void invertBlackAndWhite(){
    //RBG
    if (imagemOriginal.channels() == 3) {

        cvtColor(imagemOriginal, imagemAlterada, CV_RGB2GRAY);

        bitwise_not(imagemAlterada, imagemAlterada);

        namedWindow("Preto e Branco Invertido", CV_WINDOW_AUTOSIZE);
        imshow("Preto e Branco Invertido", imagemAlterada);
    }
        //RGBA
    else if (imagemOriginal.channels() == 4) {

        cvtColor(imagemOriginal, imagemAlterada, CV_RGBA2GRAY);

        bitwise_not(imagemAlterada, imagemAlterada);

        namedWindow("Preto e Branco Invertido", CV_WINDOW_AUTOSIZE);
        imshow("Preto e Branco Invertido", imagemAlterada);
    }
        //BLACK AND WHITE
    else
        bitwise_not(imagemOriginal, imagemAlterada);

        namedWindow("Preto e Branco Invertido", CV_WINDOW_AUTOSIZE);
        imshow("Preto e Branco Invertido", imagemAlterada);
}

//tornar a imagem parecida a uma pintura
void painting(){
    stylization(imagemOriginal, imagemAlterada);

    namedWindow("Pintura", CV_WINDOW_AUTOSIZE);
    imshow("Pintura", imagemAlterada);
}

//melhorar os detalhes da imagem
void details(){
    //RBG
    if (imagemOriginal.channels() == 3) {
        detailEnhance(imagemOriginal, imagemAlterada);

        namedWindow("Detalhes Melhorados", CV_WINDOW_AUTOSIZE);
        imshow("Detalhes Melhorados", imagemAlterada);
    }
        //RGBA
    else if (imagemOriginal.channels() == 4) {
        detailEnhance(imagemOriginal, imagemAlterada);

        namedWindow("Detalhes Melhorados", CV_WINDOW_AUTOSIZE);
        imshow("Detalhes Melhorados", imagemAlterada);
    }
        //BLACK AND WHITE
    else
        printf("\n Escolha uma imagem a cores!\n");
}


int main( int argc, char** argv )
{
    readImage();
    int op;
    int valor;
    int largura;
    int altura;
    bool cor;

    while(true){
        menu();
        cin >> op;
        printf("-------------------------------------------\n");
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
            case 5:
                printf("Largura: ");
                cin >> largura;
                printf("Altura: ");
                cin >> altura;
                resizeNotUniform(largura,altura);
                waitKey(25);
                break;
            case 6:
                transformacaoAfim();
                waitKey(25);
                break;
            case 7:
                dilateImg();
                waitKey(0);
                break;
            case 8:
                printf("Quantas vezes deseja aplicar a erosão à sua imagem? ");
                cin >> valor;
                erodeImg(valor);
                waitKey(25);
                break;
            case 9:
                cor = true;
                moldura(cor);
                waitKey(25);
                break;
            case 10:
                cor = false;
                moldura(cor);
                waitKey(25);
                break;
            case 11:
                blackAndWhite();
                waitKey(25);
                break;
            case 12:
                invertBlackAndWhite();
                waitKey(25);
                break;
            case 13:
                painting();
                waitKey(25);
                break;
            case 14:
                details();
                waitKey(25);
                break;
            case 0:
                destroyAllWindows();
                return 0;
            default:
                printf("Selecione um número válido!");
                break;
        }


    }

    destroyAllWindows();
    return 0;

}
