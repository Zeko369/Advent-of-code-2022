#!/bin/sh

if [ $# -eq 0 ]; then
  echo "Usage: day.sh <number>"
  exit 1
fi

yarn nodemon "./$1/index.js"