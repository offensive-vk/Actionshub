#########################################
## Licensed Under MIT. 2024 - Present ###
#########################################

git remote add target https://${INPUT_TARGET_USERNAME}:${INPUT_TARGET_TOKEN}@${INPUT_TARGET_URL#*://}

case "${GITHUB_EVENT_NAME}" in
    push)
        git push -f --all target
        git push -f --tags target
        ;;
    delete)
        git push -d target ${GITHUB_EVENT_REF}
        ;;
    *)
        break
        ;;
esac

#########################################
## Licensed Under MIT. 2024 - Present ###
#########################################