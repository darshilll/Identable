# Determine APP_NAME based on environment
APP_NAME := $(if $(filter production,$(TARGET_ENV)),$(APP_NAME),$(APP_NAME)-uat)
NAMESPACE := $(if $(filter production,$(TARGET_ENV)),$(NAMESPACE),$(NAMESPACE)-uat)

REMOTE_IMAGE_TAG := "$(DOCKER_REGISTRY)/$(HUAWEI_ORG)/$(APP_NAME):$(GITHUB_SHA)"

build-and-push:
	echo $(REMOTE_IMAGE_TAG)
	docker build -t $(APP_NAME) .
	
	docker tag $(APP_NAME):latest $(REMOTE_IMAGE_TAG)
	docker push $(REMOTE_IMAGE_TAG)
	
deploy:
	kubectl set image deployment/$(APP_NAME) container-0=$(REMOTE_IMAGE_TAG) -n $(NAMESPACE)
