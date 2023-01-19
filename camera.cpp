#include "opencv2/opencv.hpp"
#include <iostream>
#include <unistd.h>
#include <sys/wait.h>


int main(int argh, char* argv[])
{
    cv::VideoCapture cap(0);//デバイスのオープン
    //cap.open(0);//こっちでも良い．

    if(!cap.isOpened())//カメラデバイスが正常にオープンしたか確認．
    {
        //読み込みに失敗したときの処理
        return -1;
    }

    cv::Mat frame; //取得したフレーム

    while(cap.read(frame))//無限ループ
    {
        cv::Mat gray_img;
        cvtColor(frame, gray_img, cv::COLOR_RGB2GRAY);
        //フレーム画像を保存する．
        cv::imwrite("./public/camera.jpg", gray_img);
        usleep(300*1000);

        int status;
        pid_t pid = fork();
        if (pid == 0) {
            
                // 子プロセスが実行されている場合
                char *argv[] = {"/bin/rm","./public/camera.jpg", NULL};
                char *envp[] = {NULL};
                execve("/bin/rm", argv, envp);
            
            } else {
            
                // 親プロセスが実行
                wait(&status);
                // exitされたかどうかをチェック
                if (WIFEXITED(status)) {
                // exit()に渡されたステータスの一部を表示（正常終了なら0を表示）
                //printf("Exit: %d\n", WEXITSTATUS(status));
                }
 
        }
        

        
    }
    return 0;
}