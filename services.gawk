/http/{
    nparts = split($0, parts, ": +");
    if (nparts == 2) {
        printf "%s=", gensub("[ /]", "-", "g", tolower(parts[1]));
        print gensub("\\$ipaddr", "127.0.0.1", "G", parts[2]);
    }
}

