FROM alpine as builder
# RUN sudo curl -L https://github.com/hasura/graphql-engine/raw/master/cli/get.sh | INSTALL_PATH=$PATH/bin sudo bash
FROM hasura/graphql-engine
# SHELL ["/bin/bash", "-c"] to change the default shell
COPY --from=builder . .