SRCS = camera

CC = g++
CCFLAGS = -std=c++17
INCLUDEPATH = -I /usr/include/opencv4 -I /usr/local/include/opencv4
LIBS = -l opencv_core -l opencv_objdetect -l opencv_highgui -l opencv_imgproc -l opencv_videoio -l opencv_imgcodecs

all: $(SRCS)

%: %.cpp
	$(CC) $(CCFLAGS) $(INCLUDEPATH) $< -o $@ $(LIBS)

clean:
	rm $(SRCS)