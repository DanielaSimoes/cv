cmake_minimum_required(VERSION 3.3)
project(projeto2)

set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -std=c++11")

set(OpenCV_FOUND 1)
find_package(OpenCV REQUIRED)
set(SOURCE_FILES main.cpp)
add_executable(projeto2 ${SOURCE_FILES})
include_directories(${OpenCV_INCLUDE_DIRS})
target_link_libraries(projeto2 ${OpenCV_LIBS})