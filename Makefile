# .PHONY: proto-gen-only clean-gen proto-all proto-user proto-ai proto-gpt 

DIRNAME = _proto
DIRNAME_GEN = _proto/gen

SVC_USER = user
SVC_GPT = gpt
SVC_AI = ai

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
			--ts_proto_opt=esModuleInterop=true \
			--ts_proto_opt=returnObservable=false
endef

clean-gen:
	rm -rf $(DIRNAME_GEN)/*.pb.ts
proto-gen-only:
	$(call proto-gen,*,$(DIRNAME_GEN))

proto-user:
		$(call proto-gen,user,$(DIRNAME_GEN)) 
proto-gpt:
		$(call proto-gen,gpt,$(DIRNAME_GEN)) 
proto-ai:
		$(call proto-gen,ai,$(DIRNAME_GEN))
