#!/bin/sh

# Extract JSON value
parse_json () {
    echo $1 | \
    sed -e 's/[{}]/''/g' | \
    sed -e 's/", "/'\",\"'/g' | \
    sed -e 's/" ,"/'\",\"'/g' | \
    sed -e 's/" , "/'\",\"'/g' | \
    sed -e 's/","/'\"---SEPERATOR---\"'/g' | \
    awk -F=':' -v RS='---SEPERATOR---' "\$1~/\"$2\"/ {print}" | \
    sed -e "s/\"$2\"://" | \
    tr -d "\n\t" | \
    sed -e 's/\\"/"/g' | \
    sed -e 's/\\\\/\\/g' | \
    sed -e 's/^[ \t]*//g' | \
    sed -e 's/^"//'  -e 's/"$//'
}

# Path
result=${PWD##*/}  

# Get version
json=`cat package.json`
version=`parse_json "$json" version`

# Current date
now=$(date +"%d_%m_%Y")
machine=$(hostname)

/bin/tar -zcvf ../"$now"-"${PWD##*/}"-"$machine"-v"$version".tar.gz --exclude=../"${PWD##*/}"/node_modules --exclude=../"${PWD##*/}"/.sass-cache ../"${PWD##*/}"
echo "OK! It's all packed."