<template>
     <div class="container py-5 my-3">
    <div class="row justify-content-center">
      <div class="col-md-6 col-lg-4 border rounded">
        <div class="shadow-sm">
          <div class="card-body p-4">
            <h4 class="text-center mb-4">Create Account</h4>
            <form @submit.prevent="handleSingUp">
              <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input type="email" v-model="form.email" class="form-control" id="email" required />
              </div>
              <div class="mb-4">
                <label for="password" class="form-label">Password</label>
                <input
                  type="password"
                  v-model="form.password"
                  class="form-control"
                  id="password"
                  required
                />
              </div>
              <button :disabled="authStore.isLoading" type="submit" class="btn btn-success w-100">
                <span v-if="authStore.isLoading" class="spinner-border spinner-border-sm me-2"></span>
                Create Account
              </button>
              <div v-if="error" class="alert alert-danger mt-3 mb-0">{{  error }}</div>
            </form>
            <p class="mt-3 form-label text-center">
              Already have an account?
              <router-link :to="{name: APP_ROUTE_NAMES.SIGN_IN}">Login here</router-link>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useSwal } from '@/composibles/useSwal';
import { APP_ROUTE_NAMES } from '@/constants/routeName';
import { useAuthStore } from '@/stores/authStore';
import { auth } from '@/utility/FirebaseConfig';

const { showSuccess, showError } = useSwal();
const error = ref('');
const authStore = useAuthStore();
const form = reactive({
  email: '',
  password: ''
});

const handleSingUp = async () => {
  error.value = '';
  try {
    // Simulate API call
    await authStore.signUpUser(form.email, form.password);
    showSuccess('Account created successfully!');
  } catch (err) {
    showError(err.message || 'An error occurred');
    error.value = err.message || 'An error occurred';
  }
};

</script>