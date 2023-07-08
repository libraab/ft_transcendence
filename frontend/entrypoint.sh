#!/bin/bash

set -e

npm upgrade
npm install
npm run dev -- --host