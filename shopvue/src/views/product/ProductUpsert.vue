<template>
    <div class="container">
    <div class="row border p-4 my-5 rounded">
      <div class="col-9">
        <form v-on:submit.prevent="handleSubmit">
          <div class="h2 text-center text-success">{{ productId ? 'Update Product' : 'Create Product' }}</div>
          <hr />
          <div v-if="errorList.length" class="alert alert-danger pb-0">
            Please fix the following errors:
            <ul>
              <li v-for="(error, index) in errorList" :key="index">{{ error }}</li>
            </ul>
          </div>

          <div class="mt-3">
            <span class="text-muted">Name</span>
            <input type="text"
            v-model.trim="productObj.name" class="form-control" />
          </div>
          <div class="mt-3">
            <span class="text-muted">Description</span>
            <textarea type="text"
            v-model="productObj.description" class="form-control"></textarea>
          </div>
          <div class="mt-3">
            <span class="text-muted">Price</span>
            <input type="number"
            v-model.number="productObj.price" class="form-control" />
          </div>

          <div class="mt-3">
            <span class="text-muted">Sale Price</span>
            <input type="number"
            v-model.number="productObj.salePrice" class="form-control" />
          </div>
          <div class="mt-3">
            <span class="text-muted">Tags (comma-seperated)</span>
            <input
              type="text"
              v-model="productObj.tags"
              class="form-control"
              placeholder="e.g., modern, classic, luxury"
            />
          </div>
          <div class="form-check form-switch pt-3">
            <input class="form-check-input"
            v-model="productObj.isBestSeller" type="checkbox" role="switch" />

            <label class="form-check-label" for="bestseller">
              Bestseller
            </label>
          </div>
          <div class="mt-3">
            <label class="text-muted">Category</label>
            <select class="form-select" v-model="productObj.category">
                <option v-for="(category, index) in PRODUCT_CATEGORIES" :key="index" :value="category">
                    {{ category }}
                </option>
            </select>
          </div>
          <div class="mb-3">
            <label class="form-label">Image</label>
            <div class="input-group">
              <input type="file" class="form-control" 
              @change="handleFileUpload" :disabled="isImageUploading" />
            </div>
          </div>
          <div class="pt-3">
            <button class="btn btn-success m-2 w-25" :disabled="loading || isImageUploading">
              <span v-if="loading || isImageUploading" class="spinner-border spinner-border-sm me-2"></span>Submit
            </button>
            <router-link :to="{ name: APP_ROUTE_NAMES.PRODUCT_LIST }" class="btn btn-secondary m-2 w-25"> Cancel </router-link>
          </div>
        </form>
      </div>
      <div class="col-3">
        <img
          :src="productObj.image || `https://placehold.co/600x400`"
          class="img-fluid w-100 m-3 p-3 rounded"
          alt="Product
        preview"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, h } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { PRODUCT_CATEGORIES } from '@/constants/appConstants';
import { useSwal } from '@/composibles/useSwal';
import productService from '@/services/productService';
import { APP_ROUTE_NAMES } from '@/constants/routeName';
import { uploadToCloudinary } from '@/utility/cloudinary';
const { showSuccess, showError, showConfirm } = useSwal();

const router = useRouter();
const route = useRoute();
const loading = ref(false);
const isImageUploading = ref(false);
const errorList = reactive([]);
const productObj = reactive({
    name: '',
    description: '',
    price: 0,
    salePrice: 0,
    tags: [],
    isBestSeller: false,
    category: '',
    image: 'https://placehold.co/600x400',
})
const productId = ref(route.params.id || null);

onMounted(() => {
    if (productId.value) {
        fetchProductDetails(productId.value);
    }
});

async function handleSubmit() {

    try {
        loading.value = true;
        errorList.length = 0; // Clear previous errors

        // validations
        if (productObj.name.length < 3) {
            errorList.push('Product name must be at least 3 characters long.');
        }
        if (productObj.price <= 0) {
            errorList.push('Price should be greater than 0.');
        }
        if (productObj.category === '') {
            errorList.push('Please select a category.');
        }

        if (!errorList.length) {
          const productData = {
            ...productObj,
            price: Number(productObj.price),
            salePrice: productObj.salePrice? Number(productObj.salePrice) : null,
            tags: productObj.tags.length > 0 ? productObj.tags.split(',').map((tag) => tag.trim()) : [],
            isBestSeller: Boolean(productObj.isBestSeller),
          }
          
          if (productId.value) {
            // Update existing product
            await productService.updateProduct(productId.value, productData);
            showSuccess('Product updated successfully!');
          } else {
            // Create new product
            await productService.createProduct(productData);
            showSuccess('Product created successfully!');
          }
          console.log('Product Data:', productData);

          router.push({
            name: APP_ROUTE_NAMES.PRODUCT_LIST,
          });
        }
    }
    catch(e) {
        console.log(e);
    }
    finally {
        loading.value = false;
    }
}

async function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    isImageUploading.value = true;
    try {
        const imageUrl = await uploadToCloudinary(file);
        productObj.image = imageUrl;
        showSuccess('Image uploaded successfully!');
    } catch (error) {
        console.error('Error uploading image:', error);
        showError('Failed to upload image.');
    } finally {
        isImageUploading.value = false;
    }
}

async function fetchProductDetails(id) {
    try {
        loading.value = true;
        const product = await productService.getProductById(id);
        Object.assign(productObj, { ...product, tags: product.tags.join(', ') });
    } catch (error) {
        console.error('Error fetching product details:', error);
        showError('Failed to fetch product details.');
    } finally {
        loading.value = false;
    }
}

</script>