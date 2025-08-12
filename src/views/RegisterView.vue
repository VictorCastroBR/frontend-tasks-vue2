<template>
  <v-card max-width="600" class="mx-auto">
    <v-card-title>Crie sua empresa</v-card-title>
    <v-card-text>
      <v-form @submit.prevent="submit">
        <v-text-field v-model="form.company_name" label="Nome da empresa" required />
        <v-text-field v-model="form.company_slug" label="Slug (ex: minha-empresa)" required />
        <v-text-field v-model="form.name" label="Seu nome" required />
        <v-text-field v-model="form.email" label="E-mail" type="email" required />
        <v-text-field v-model="form.password" label="Senha" type="password" required />
        <v-alert type="error" dense v-if="err">{{ err }}</v-alert>
        <v-btn type="submit" color="primary" :loading="loading" block>Criar conta</v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</template>
<script>
import api from '@/services/api'; import auth from '@/store/auth'
export default {
    data:()=>({
        form:{
            company_name:'',
            company_slug:'',
            name:'',
            email:'',
            password:''
        },
        loading:false,
        err:'' 
    }),
    methods:{
        async submit() {
            this.loading=true; this.err=''
            try{
                const { data } = await api.post('/auth/register', this.form)
                auth.actions.loginSuccess({ token:data.token, user:data.user })
                this.$router.push('/')
            }catch(e) {
                this.err=e?.response?.data?.message||'Erro ao registrar' 
            } finally{ this.loading=false }
        }
    }
}
</script>
