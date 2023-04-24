.PHONY: proto-gen-only clean-gen proto-all proto-auth proto-product proto-order 

DIRNAME = _proto
DIRNAME_GEN = _proto/gen

SVC_AUTH = auth
DIRNAME_GETEWAY_AUTH= apps/api-gateway/src/auth
DIRNAME_SVC_AUTH= apps/auth-svc/src/auth

SVC_PRODUCT = product
DIRNAME_GETEWAY_PRODUCT = apps/api-gateway/src/product
DIRNAME_SVC_PRODUCT = apps/product-svc/src/product

SVC_ORDER = order
DIRNAME_GETEWAY_ORDER = apps/api-gateway/src/order
DIRNAME_SVC_ORDER = apps/order-svc/src/order/proto

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

proto-all: proto-auth proto-product proto-order 

proto-auth:
		$(call proto-gen,$(SVC_AUTH),$(DIRNAME_GEN)) 
#		$(call proto-gen,$(SVC_AUTH),$(DIRNAME_GETEWAY_AUTH))
#		$(call proto-gen,$(SVC_AUTH),$(DIRNAME_SVC_AUTH)) 

proto-product:
		$(call proto-gen,$(SVC_PRODUCT),$(DIRNAME_GEN)) 
#		$(call proto-gen,$(SVC_PRODUCT),$(DIRNAME_GETEWAY_PRODUCT))
#		$(call proto-gen,$(SVC_PRODUCT),$(DIRNAME_SVC_PRODUCT)) 
proto-order:
		$(call proto-gen,$(SVC_ORDER),$(DIRNAME_GEN)) 
		$(call proto-gen,$(SVC_PRODUCT),$(DIRNAME_GEN)) 
#		$(call proto-gen,$(SVC_ORDER),$(DIRNAME_GETEWAY_ORDER))
#		$(call proto-gen,$(SVC_ORDER),$(DIRNAME_SVC_ORDER)) 
#		$(call proto-gen,$(SVC_PRODUCT),$(DIRNAME_SVC_ORDER)) 


