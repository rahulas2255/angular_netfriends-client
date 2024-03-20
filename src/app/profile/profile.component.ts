import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { window } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  profileDetails:any = {}
  loginUsername:String = ""
  loginName:String = ""
  files:any = []
  profileImage:String = ""
  comment:String = ""
  userId:string = ""
  profilePost:any = {}
  constructor(public api:ApiService,private route:ActivatedRoute,private toaster:ToastrService,private router:Router){}


 ngOnInit(): void {
  console.log(this.profileDetails);
   this.route.params.subscribe((res:any)=>{
    console.log(res);
    const {id} = res
    this.getUserPost(id)
    
    
    
   })
   if(sessionStorage.getItem("existingUser")){
    const existingUser = JSON.parse(sessionStorage.getItem("existingUser") || "")
    this.loginName = existingUser.name
    this.loginUsername = existingUser.username
    this.userId = existingUser._id
    this.profileDetails = existingUser
    this.profileDetails.profilePicture = `${this.api.SERVER_URL}/user-image/${this.profileDetails.profilePicture}`

    console.log(this.userId);
    
  }else{
    this.loginName = ""
    this.loginUsername = ""

  }
  


   
 }
 
 onFileChanges(event:any){
  this.files = event.target.files[0];
  this.profileDetails.profilePicture = this.files
  let fr = new FileReader()
  fr.readAsDataURL(this.files)
  fr.onload = (event:any)=>{
    this.profileImage = event.target.result
  }
 }
 closeModal(){
  this.profileImage = ""
  document.getElementById('closeModal')?.click()
 }

 getUserPost(id:any){
  this.api.getUserPosts(id).subscribe((res:any)=>{
   this.profilePost = res.map((item:any)=>{
    item.postImage = `${this.api.SERVER_URL}/post-image/${item.postImage}`
    item.user.profilePicture = `${this.api.SERVER_URL}/user-image/${item.user.profilePicture}`
    return item
  })
   console.log(this.profilePost);
   
  })
   
 }

 commentPost(id:any):any{
  if(!this.comment) return this.toaster.warning('Please type any comment!!!')
  this.api.postCommentAPI(this.comment,id).subscribe({
  next:(res:any)=>{
    console.log(res);
    document.getElementById('closeModal')?.click()
  },
  error:(res:any)=>{
    console.log(res.error);
    
  }
})
}

likeToggle(id:any){
  this.api.likePostAPI(id).subscribe({
    next:(res:any)=>{
      console.log(res);
      
      
      
    },
    error:(res:any)=>{
      console.log(res.error);
      
    }
  })
}
logout(){
  sessionStorage.clear()
  this.router.navigateByUrl('/')
  
}
updateProfile(){
  console.log(this.profileDetails);
  const formData = new FormData()
  formData.append('profilePicture',this.profileDetails.profilePicture)
  formData.append('name',this.profileDetails.name),
  formData.append('username',this.profileDetails.username),
  formData.append('email',this.profileDetails.email)
  formData.append('password',this.profileDetails.password)
  formData.append('dateOfBirth',this.profileDetails.dateOfBirth)
  formData.append('place',this.profileDetails.place)
  console.log(formData);
  
  this.api.updateProfileAPI(this.profileDetails._id,formData).subscribe({
    next:(res:any)=>{
      console.log(res);
      this.closeModal()
      sessionStorage.setItem("existingUser",JSON.stringify(res))
      

    },
    error:(err:any)=>{
      console.log(err);
      
    }
  })
  
  

}

}
