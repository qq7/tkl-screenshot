#!/bin/bash -e

# A script for updating the screenshots for all TKL appliances
# Copyright © 2015-2016 Anton Pyrogovskyi <anton@turnkeylinux.org>

# depends on: git, hub, casperjs, gawk
# https://github.com/github/hub

# (slightly) interactive
# for headless usage, set GITHUB_USER and GITHUB_PASSWORD or GITHUB_TOKEN

ROOTFS='build/root.sandbox'
CASPER='casperjs --log-level=debug --verbose --ignore-ssl-errors=true'
# CASPER='casperjs --ignore-ssl-errors=true'

ESSENTIAL_SERVICES='apache2 nginx lighttpd stunnel4 webmin'

show_help () {
    cat << EOF
screenshot.sh, a utility for screenshotting TKL appliances

Options:

    -h | --help: show this message
    -o [<path>] | --to [<path>]: parent folder of the app repos (default: /turnkey/fab/products)
    -n | --noclone: do not clone the apps, use what's already there in -o/--to
    -d | --deep: make a deep clone (default is shallow)
    -i [<path>] | --inithook=<path>: specify the inithooks.conf location
    -l [<path>] | --appliance-list=<path>: specify the list of appliances to clone/screenshot
    <app>: screenshot a specified appliance only
EOF
}

# defaults
CLONE=1
CLONE_TO=/turnkey/fab/products
INITHOOKS=inithooks.conf
APPLIANCES=appliances.txt
DEPTH_ARG='--depth=1'
VERBOSE=0

while :; do
    case $1 in
        -h|-\?|--help)
            show_help
            exit
            ;;
        -n|--no-clone)
            CLONE=0
            ;;
        -o|--to)
            if [ -n "$2" ]; then
                CLONE_TO=$2
                shift 2
                continue
            else
                printf 'ERROR: "--to" requires a non-empty option argument.\n' >&2
                exit 1
            fi
            ;;
        -i|--inithooks)
            if [ -n "$2" ]; then
                INITHOOKS=$2
                shift 2
                continue
            else
                printf 'ERROR: "--inithooks" requires a non-empty option argument.\n' >&2
                exit 1
            fi
            ;;
        -d|--deep)
            DEPTH_ARG=''
            ;;
        -v|--verbose)
            VERBOSE=1
            ;;
        --)
            shift
            break
            ;;
        -?*)
            printf 'WARN: Unknown option (ignored): %s\n' "$1" >&2
            ;;
        *)
            break
    esac

    shift
done

[ -d casperjs ] || exit 1
SRC=$(pwd)
JS=$(pwd)/casperjs

[ $CLONE -eq 1 ] && [ -d $CLONE_TO ] || mkdir -p $CLONE_TO

service_dispatch () {
    cd $ROOTFS
    for service in $ESSENTIAL_SERVICES; do
        [ -d $ROOTFS/etc/$service ] && fab-chroot . "service $service $1"
    done
    
    for i in etc/rc3.d/S*; do
        if echo $i | grep -vqe confconsole; then
            fab-chroot . "/$i $1"
        fi
    done
    cd -
}

cd $CLONE_TO

if [ $CLONE -eq 1 ]; then
    echo 'Cloning repositories...'
    if [[ -e $SRC/$APPLIANCES ]]; then
	# Clone some of them
        for i in $( cat $SRC/$APPLIANCES ); do
            git clone --quiet $DEPTH_ARG "git@github.com/turnkeylinux-apps/$i.git"
        done
    else
	# Clone all of them
        curl -s 'https://api.github.com/orgs/turnkeylinux-apps/repos?per_page=1000' | \
        grep -o 'git@[^"]*' | xargs -L1 git clone --quiet $DEPTH || \
        true # don't fail if some repos exist already
    fi
fi

for app in *; do
    cd $app

    if git branch | grep 'screenshots$'; then
        echo "Skipping already screenshot $app."
        cd ..
        continue
    else
        echo "Screenshotting $app..."
    fi

    make redeck
    if ! make CHROOT_ONLY=y &> log.txt; then
        echo "Error encountered when building $app!"
    fi

    cp $SRC/$INITHOOKS $ROOTFS/etc/inithooks.conf

    fab-chroot $ROOTFS '/usr/lib/inithooks/run'
    fuser -sk $ROOTFS || true
    service_dispatch start

    $CASPER $JS/screenshot.js

    mkdir -p /tmp/screenshots-$app
    cp .art/*.png /tmp/screenshots-$app &> log.txt

    service_dispatch stop

    rm -f $ROOTFS/etc/inithooks.conf

    hub fork || true
    git checkout -b screenshots

    # git add .art
    # git commit -m 'Update screenshots'
    # git push origin screenshots

    # git pull-request -m 'Update screenshots' -b $app:master

    git checkout master

    echo "All done screenshotting $app!"

    cd ..
done
