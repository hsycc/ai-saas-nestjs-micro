.PHONY: proto-gen-only clean-gen proto-all proto-user proto-tpl proto-gpt 

DIRNAME = _proto
DIRNAME_GEN = _proto/gen

SVC_USER = user
DIRNAME_GETEWAY_USER= apps/api-gateway/src/user
DIRNAME_SVC_USER= apps/user-svc/src/user

SVC_TPL = tpl
DIRNAME_GETEWAY_TPL = apps/api-gateway/src/tpl
DIRNAME_SVC_TPL = apps/tpl-svc/src/tpl

SVC_GPT = gpt
DIRNAME_GETEWAY_GPT = apps/api-gateway/src/gpt
DIRNAME_SVC_GPT = apps/gpt-svc/src/gpt/proto

define proto-gen 
    mkdir -p $(2)

   	protoc  --plugin=node_modules/ts-proto/protoc-gen-ts_proto \
			-I=./$(DIRNAME)  \
			$(DIRNAME)/$(1).proto \
			--ts_proto_out=$(2) \
			--ts_proto_opt=fileSuffix=.pb \
			--ts_proto_opt=nestJs=true \
			--ts_proto_opt=addGrpcMetadata=true \
			--ts_proto_opt=addNestjsRestParameter=true  \
			--ts_proto_opt=returnObservable=false
endef


clean-gen:
	rm -rf $(DIRNAME_GEN)/*.pb.ts
proto-gen-only:
	$(call proto-gen,*,$(DIRNAME_GEN))

proto-all: proto-user proto-gpt 

proto-user:
		$(call proto-gen,$(SVC_USER),$(DIRNAME_GEN)) 
#		$(call proto-gen,$(SVC_USER),$(DIRNAME_GETEWAY_USER))
#		$(call proto-gen,$(SVC_USER),$(DIRNAME_SVC_USER)) 

# proto-tpl:
# 		$(call proto-gen,$(SVC_TPL),$(DIRNAME_GEN)) 
# #		$(call proto-gen,$(SVC_TPL),$(DIRNAME_GETEWAY_TPL))
# #		$(call proto-gen,$(SVC_TPL),$(DIRNAME_SVC_TPL)) 
proto-gpt:
		$(call proto-gen,$(SVC_GPT),$(DIRNAME_GEN)) 
#		$(call proto-gen,$(SVC_GPT),$(DIRNAME_GETEWAY_GPT))
#		$(call proto-gen,$(SVC_GPT),$(DIRNAME_SVC_GPT)) 


